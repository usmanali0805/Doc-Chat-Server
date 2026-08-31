import { Router } from "express";
import { DeleteDocument, GetAllDocument, GetDocumentStatus, GetSingleDocument, UploadDocument } from "../controller/DocController.js";
const documentRoutes = Router()

documentRoutes.get('/',GetAllDocument)
documentRoutes.post('/upload',UploadDocument)
documentRoutes.get('/:id',GetSingleDocument)
documentRoutes.get('/:id/status',GetDocumentStatus)
documentRoutes.delete('/:id',DeleteDocument)

export default documentRoutes