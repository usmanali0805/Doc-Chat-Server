import Chunk from "../models/chunkmodel.js"
import Document from "../models/Docmodel.js"
import chunkPages from "../services/chunkService.js"
import { embedChunks } from "../services/embeddingService.js"
import { ExtractTextFromPDF } from "../services/pdfService.js"

function GetAllDocument(req, res) {
    const { documentId, userId, content, embedding, pageNumber, ChunkIndex } = req.body

}

async function UploadDocument(req, res) {
    const filepath = req.file.path

    const doc =  await Document.create({
        userId : req.userId,
        filename : req.file.filename,
        status : "processing"
    })

    const result = await ExtractTextFromPDF(filepath, res)

    const chunks = chunkPages(result.data || result);   // jo bhi actual return shape hai

    const embeddedChunks = await embedChunks(chunks)
    
    const chunkDocs = embedChunks.map((c)=>({
        documentId : doc._id,
        content : c.content,
        embedding : c.embedding,
        pageNumber : c.pageNumber,
        ChunkIndex : c.chunkIndex

    }))

    await Chunk.insertMany(chunkDocs)

    console.log(`Total chunks created: ${chunks.length}`);
    console.log(chunks[0]);
    console.log(chunks[1]);

    return res.status(200).json({
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