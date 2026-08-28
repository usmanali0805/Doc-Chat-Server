import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    userId: ObjectId(userId),
    filename: String,
    totalpages: Number,
    status: "processing" || "ready" || "failed",
    createdAt: new Date()
})