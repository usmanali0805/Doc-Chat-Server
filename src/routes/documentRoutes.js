import { Router } from "express";
import { DeleteDocument, GetAllDocument, GetDocumentStatus, GetSingleDocument, UploadDocument } from "../controller/DocController.js";
import multer from "multer";
const documentRoutes = Router()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "document/")
    },
    filename: (req, file, cb) => {
        const date = new Date()
        const uniqueName =
            date.getDate() + '-' + date.getMonth() + '-' +
            Math.round(Math.random() * 1e9) + file.originalname;

        cb(null, uniqueName);
    },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};



const upload = multer({
    fileFilter,
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024
    }
});

documentRoutes.get('/', GetAllDocument)
documentRoutes.post('/upload', upload.single('document'), UploadDocument)
documentRoutes.get('/:id', GetSingleDocument)
documentRoutes.get('/:id/status', GetDocumentStatus)
documentRoutes.delete('/:id', DeleteDocument)

export default documentRoutes