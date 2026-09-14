import chunkPages from "../services/chunkService.js"
import { ExtractTextFromPDF } from "../services/pdfService.js"

function GetAllDocument(req, res) {
    const { documentId, userId, content, embedding, pageNumber, ChunkIndex } = req.body

}

async function UploadDocument(req, res) {
    const filepath = req.file.path

    const result = await ExtractTextFromPDF(filepath, res)

    const chunks = chunkPages(result.data || result);   // jo bhi actual return shape hai

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