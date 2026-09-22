import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
    documentId :{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Document",
        reguired: true
    },
    content : {
        type :String,
        required:true
    },
    embedding :{
        type: [Number] ,
        required :true
    } 
     ,
    pageNumber : Number ,
    ChunkIndex : Number
})

const Chunk = mongoose.model('Chunk' , chunkSchema)

export default Chunk