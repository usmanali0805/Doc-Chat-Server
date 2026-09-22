import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { DeleteDocument, DocumentHistory, UploadDocumentChat } from "../controller/chatController.js";

const chatRoutes = Router();
chatRoutes.use(authMiddleware);   // ← yeh add karo

chatRoutes.post('/:documentid', UploadDocumentChat);
chatRoutes.get('/:documentid/history', DocumentHistory);
chatRoutes.delete('/:documentid', DeleteDocument);

export default chatRoutes;