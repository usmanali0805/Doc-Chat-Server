import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    totalpages: {
        type: Number,
        default :0
    },
    status: {
        type: String,
        enum: ["processing" , "ready" , "failed"],
        default: "processing",
    },
},
    { timestamps: true }
)

const Document = mongoose.model("Document", DocumentSchema);

export default Document;