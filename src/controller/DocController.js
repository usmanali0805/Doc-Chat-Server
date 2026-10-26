import mongoose from "mongoose"
import Chunk from "../models/chunkmodel.js"
import Document from "../models/Docmodel.js"
import chunkPages from "../services/chunkService.js"
import { embedChunks } from "../services/embeddingService.js"
import { ExtractTextFromPDF } from "../services/pdfService.js"
import Chat from "../models/chatmodel.js"

async function GetAllDocument(req, res) {
    try {
        const documents = await Document.find({ userId: req.userId }).sort({ createdAt: -1 })
            .select("_id filename totalpages status createdAt");

        const formatted = documents.map((doc) => ({
            documentId: doc._id,
            filename: doc.filename,
            totalpages: doc.totalpages,
            status: doc.status,
        }));
        res.status(200).json({
            status: true,
            message: "data fetch successfully",
            data: formatted
        })
    } catch (error) {
        console.error("GetAllDocument error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch documents" });

    }
}

async function UploadDocument(req, res) {
    const filepath = req.file.path

    const doc = await Document.create({
        userId: req.userId,
        filename: req.file.filename,
        status: "processing"
    })

    const result = await ExtractTextFromPDF(filepath, res)

    const chunks = chunkPages(result.data || result);   

    const embeddedChunks = await embedChunks(chunks)

    console.log(embeddedChunks)
    const chunkDocs = embeddedChunks.map((c) => ({
        documentId: doc._id,
        content: c.content,
        embedding: c.embedding,
        pageNumber: c.pageNumber,
        ChunkIndex: c.ChunkIndex

    }))

    await Chunk.insertMany(chunkDocs)
const totalPages = result.length;
    doc.status = "ready";
    doc.totalpages = totalPages;
    await doc.save();
 

    return res.status(200).json({
      documentId: doc._id,
      filename: doc.filename,
      totalpages: doc.totalpages,
      totalChunks: chunks.length,
      status: doc.status,
    });
}

function GetSingleDocument(req, res) {

}

function GetDocumentStatus(req, res) {

}

async function DeleteDocument(req, res) {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ status: false, message: "Invalid document id" });
    }

    const doc = await Document.findOneAndDelete({ _id: id, userId: req.userId });

    if (!doc) {
      return res.status(404).json({ status: false, message: "Document not found" });
    }

    await Promise.all([
      Chunk.deleteMany({ documentId: doc._id }),
      Chat.deleteMany({ documentId: doc._id }),
    ]);

    res.status(200).json({ status: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("DeleteDocument error:", error);
    res.status(500).json({ status: false, message: "Failed to delete document" });
  }
}

async function HandleSend(text) {
  if (!text.trim() || !activeDocumentId) return;

  const targetDocId = activeDocumentId;
  const botId = crypto.randomUUID();

  setMessages((prev) => [
    ...prev,
    { id: crypto.randomUUID(), role: "user", text },
    { id: botId, role: "assistant", text: "", sources: [] },
  ]);
  setIsTyping(true);

  try {
    const res = await apiFetch(`chat/${targetDocId}/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text }),
    });
    if (!res) return;
    if (!res.ok) throw new Error("Server error response");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop();

      for (const evt of events) {
        if (!evt.startsWith("data: ")) continue;
        const payload = JSON.parse(evt.slice(6));

        if (currentDocRef.current !== targetDocId) return;

        if (payload.token) {
          setIsTyping(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId ? { ...m, text: m.text + payload.token } : m,
            ),
          );
        }
        if (payload.done) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId ? { ...m, sources: payload.sources || [] } : m,
            ),
          );
        }
        if (payload.error) throw new Error(payload.error);
      }
    }
  } catch (err) {
    if (currentDocRef.current !== targetDocId) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === botId
          ? { ...m, text: m.text || "Sorry, something went wrong. Please try again." }
          : m,
      ),
    );
  } finally {
    if (currentDocRef.current === targetDocId) setIsTyping(false);
  }
}


export { GetAllDocument, UploadDocument, GetDocumentStatus, GetSingleDocument, DeleteDocument, HandleSend }