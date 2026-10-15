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


export { GetAllDocument, UploadDocument, GetDocumentStatus, GetSingleDocument, DeleteDocument }