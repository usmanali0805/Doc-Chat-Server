import { Router } from "express";
const chatRoutes = Router()

chatRoutes.post('/:documentid' ,()=>{})
chatRoutes.get('/:documentid/history' ,()=>{})
chatRoutes.delete('/:documentid' ,()=>{})

export default chatRoutes;