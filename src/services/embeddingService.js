import genAI from "../config/gemini.js";

export async function embedText(text) {
    const result = await genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
    });
    return result.embeddings[0].values;
}

export async function embedChunks(chunks) {
    const embeddingChunks = [];

    for (const chunk of chunks) {
        const embedding = await embedText(chunk.content);
        embeddingChunks.push({
            ...chunk,
            embedding,
        });
    }

    return embeddingChunks;
}