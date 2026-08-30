import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    documentId :{
        type :mongoose.Schema.Types.ObjectId,
        ref : "Document",
        required : true
    },
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    message :{
        role : {
            type: String,
            required : true,
            enum : ["User" , "assistant"],
        },
        text :{
            required : true ,
            type : String,
        },
        sources :{
            type : [Number] , 
            required : true
        },
    },
},
{ timestamps : true}
)

const Chat = mongoose.model('Chat' , chatSchema)
export default chatSchema