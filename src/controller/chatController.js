import { searchRelevantChunks, generateAnswer } from "../services/ragService.js";
import Chat from "../models/chatmodel.js";
import mongoose from "mongoose";
import Document from "../models/Docmodel.js";

// POST /:documentid — question poocho, answer milega
export async function UploadDocumentChat(req, res) {
    try {
        const { documentid } = req.params;
        const { question } = req.body;

        if (!mongoose.isValidObjectId(documentid)) {
            return res.status(400).json({ status: false, message: "Invalid document id" });
        }

        const doc = await Document.findOne({ _id: documentid, userId: req.userId });
        if (!doc) {
            return res.status(404).json({ status: false, message: "Document not found" });
        }


        if (!question) {
            return res.status(400).json({ message: "question is required" });
        }

        const chunks = await searchRelevantChunks(documentid, question);
        const answer = await generateAnswer(question, chunks);
        const sources = [...new Set(chunks.map((c) => c.pageNumber))];

        let chat = await Chat.findOne({ documentId: documentid, userId: req.userId });
        if (!chat) {
            chat = await Chat.create({ documentId: documentid, userId: req.userId, messages: [] });
        }

        chat.messages.push({ role: "user", text: question });
        chat.messages.push({ role: "assistant", text: answer, sources });
        await chat.save();

        return res.status(200).json({ answer, sources });

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({ error: err.message });
    }
}

// GET /:documentid/history — poori chat history dikhao
export async function DocumentHistory(req, res) {
    try {
        const { documentid } = req.params;

        if (!mongoose.isValidObjectId(documentid)) {
            return res.status(400).json({ status: false, message: "Invalid document id" });
        }

        const doc = await Document.findOne({ _id: documentid, userId: req.userId });
        if (!doc) {
            return res.status(404).json({ status: false, message: "Document not found" });
        }
        const chat = await Chat.findOne({ documentId: documentid, userId: req.userId });

        if (!chat) {
            return res.status(200).json({ messages: [] });
        }

        return res.status(200).json({ messages: chat.messages });

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({ error: err.message });
    }
}

// DELETE /:documentid — chat history delete karo
export async function DeleteDocument(req, res) {
    try {
        const { documentid } = req.params;

        const deleted = await Chat.findOneAndDelete({ documentId: documentid, userId: req.userId });

        if (!deleted) {
            return res.status(404).json({ message: "Chat not found" });
        }

        return res.status(200).json({ message: "Chat deleted successfully" });

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({ error: err.message });
    }
}