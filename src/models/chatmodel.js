import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [                          // ← "messages" (PLURAL) aur array [ ] ke andar
        {
            role: {
                type: String,
                required: true,
                enum: ["user", "assistant"],   // lowercase
            },
            text: {
                type: String,
                required: true,
            },
            sources: {
                type: [Number],
                default: [],
            },
        }
    ],
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;