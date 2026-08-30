import { Router } from "express";
const documentRoutes = Router()

documentRoutes.get('/',()=>{})
documentRoutes.post('/upload',()=>{})
documentRoutes.get('/:id',()=>{})
documentRoutes.get('/:id/status',()=>{})
documentRoutes.delete('/:id',()=>{})

export default documentRoutes