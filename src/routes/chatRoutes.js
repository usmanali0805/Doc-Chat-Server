import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
     DocumentHistory,
      UploadDocumentChat, 
      UploadDocumentChatStream
    } from "../controller/chatController.js";

const chatRoutes = Router();
chatRoutes.use(authMiddleware);   

chatRoutes.post('/:documentid', UploadDocumentChat);
chatRoutes.get('/:documentid/history', DocumentHistory);
chatRoutes.post('/:documentid/stream', UploadDocumentChatStream);

export default chatRoutes;