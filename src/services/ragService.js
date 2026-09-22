// backend/src/services/ragService.js
import genAI from "../config/gemini.js";
import Chunk from "../models/Chunk.js";
import { embedText } from "./embeddingService.js";

export async function searchRelevantChunks(documentId, question, topK = 5) {
    const questionEmbedding = await embedText(question);

    const results = await Chunk.aggregate([
        {
            $vectorSearch: {
                index: "DocChat",              // apna index ka naam yahan daalo (jo tumne Atlas mein diya)
                path: "embedding",
                queryVector: questionEmbedding,
                numCandidates: 100,
                limit: topK,
                filter: { documentId: documentId },
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

export async function generateAnswer(question, chunks) {
    const context = chunks
        .map((c, i) => `[Source ${i + 1} - Page ${c.pageNumber}]\n${c.content}`)
        .join("\n\n");

    const prompt = `You are a helpful assistant answering questions based ONLY on the provided document context. 
If the answer is not in the context, say you don't know based on the document.

Context:
${context}

Question: ${question}

Answer clearly and cite which page(s) you used.`;

    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",   // chat/text generation ke liye alag model
        contents: prompt,
    });

    return result.text;
}