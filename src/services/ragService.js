
// import mongoose from "mongoose";   
// import genAI from "../config/gemini.js";
// import Chunk from "../models/chunkmodel.js";
// import { embedText } from "./embeddingService.js";

// export async function searchRelevantChunks(documentId, question, topK = 5) {
//     const questionEmbedding = await embedText(question);

//     const results = await Chunk.aggregate([
//         {
//             $vectorSearch: {
//                 index: "DocChat",
//                 path: "embedding",
//                 queryVector: questionEmbedding,
//                 numCandidates: 100,
//                 limit: topK,
//                 filter: { documentId: new mongoose.Types.ObjectId(documentId) },   
//             },
//         },
//         {
//             $project: {
//                 content: 1,
//                 pageNumber: 1,
//                 score: { $meta: "vectorSearchScore" },
//             },
//         },
//     ]);

//     return results;
// }

// export async function generateAnswer(question, chunks) {
//     const context = chunks
//         .map((c, i) => `[Source ${i + 1} - Page ${c.pageNumber}]\n${c.content}`)
//         .join("\n\n");

//     const prompt = `You are a helpful assistant answering questions based ONLY on the provided document context. 
// If the answer is not in the context, say you don't know based on the document.

// Context:
// ${context}

// Question: ${question}

// Answer clearly and cite which page(s) you used.`;

//     const result = await genAI.models.generateContent({
//         model: "gemini-3.5-flash-lite",
//         contents: prompt,
//     });

//     return result.text;
// }


import mongoose from "mongoose";   
import genAI from "../config/gemini.js";
import Chunk from "../models/chunkmodel.js";
import { embedText } from "./embeddingService.js";

export async function searchRelevantChunks(documentId, question, topK = 5) {
    const questionEmbedding = await embedText(question);

    const results = await Chunk.aggregate([
        {
            $vectorSearch: {
                index: "DocChat",
                path: "embedding",
                queryVector: questionEmbedding,
                numCandidates: 100,
                limit: topK,
                filter: { documentId: new mongoose.Types.ObjectId(documentId) },   
            },
        },
        {
            $project: {
                content: 1,
                pageNumber: 1,
                score: { $meta: "vectorSearchScore" },
            },
        },
    ]);

    return results;
}

// NAYA: prompt ek jagah, dono functions share karenge
function buildPrompt(question, chunks) {
    const context = chunks
        .map((c, i) => `[Source ${i + 1} - Page ${c.pageNumber}]\n${c.content}`)
        .join("\n\n");

    return `You are a helpful assistant answering questions based ONLY on the provided document context. 
If the answer is not in the context, say you don't know based on the document.

Context:
${context}

Question: ${question}

Answer clearly and cite which page(s) you used.`;
}

export async function generateAnswer(question, chunks) {
    const prompt = buildPrompt(question, chunks);

    const result = await genAI.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
    });

    return result.text;
}

// NAYA: streaming version
export async function* generateAnswerStream(question, chunks) {
    const prompt = buildPrompt(question, chunks);

    const stream = await genAI.models.generateContentStream({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
    });

    for await (const chunk of stream) {
        if (chunk.text) yield chunk.text;
    }
}