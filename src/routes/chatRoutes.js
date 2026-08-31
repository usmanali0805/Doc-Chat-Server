import { Router } from "express";
import { DeleteDocument, DocumentHistory, UploadDocumentChat } from "../controller/chatController.js";
const chatRoutes = Router()

chatRoutes.post('/:documentid' ,UploadDocumentChat)
chatRoutes.get('/:documentid/history' ,DocumentHistory)
chatRoutes.delete('/:documentid' ,DeleteDocument)

export default chatRoutes;