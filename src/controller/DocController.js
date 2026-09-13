import { ExtractTextFromPDF } from "../services/pdfService.js"

function GetAllDocument(req, res) {
    const { documentId, userId, content, embedding, pageNumber, ChunkIndex } = req.body

}

async function UploadDocument(req, res) {
    const filepath = req.file.path
    
    const result = await ExtractTextFromPDF(filepath, res)

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