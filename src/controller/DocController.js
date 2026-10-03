import Chunk from "../models/chunkmodel.js"
import Document from "../models/Docmodel.js"
import chunkPages from "../services/chunkService.js"
import { embedChunks } from "../services/embeddingService.js"
import { ExtractTextFromPDF } from "../services/pdfService.js"

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

    const chunks = chunkPages(result.data || result);   // jo bhi actual return shape hai

    const embeddedChunks = await embedChunks(chunks)

    const chunkDocs = embeddedChunks.map((c) => ({
        documentId: doc._id,
        content: c.content,
        embedding: c.embedding,
        pageNumber: c.pageNumber,
        ChunkIndex: c.chunkIndex

    }))

    await Chunk.insertMany(chunkDocs)

    console.log(`Total chunks created: ${chunks.length}`);

    return res.status(200).json({
        documentId: doc._id,
        data: result

    })
}

function GetSingleDocument(req, res) {

}

function GetDocumentStatus(req, res) {

}

function DeleteDocument(req, res) {

}


export { GetAllDocument, UploadDocument, GetDocumentStatus, GetSingleDocument, DeleteDocument }