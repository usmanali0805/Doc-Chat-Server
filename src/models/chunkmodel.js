import mongoose, { model } from "mongoose";

const chunkSchema = new mongoose.Schema({
    documentId : ObjectId(documentId),
    content : String ,
    embedding : [Number] ,
    pageNumber : Number ,
    ChunkIndex : Number
})

const Chunk = model.model('ChunkSchema' , chunkSchema)

export default Chunk