import genAI from "../config/gemini.js";


export default async function embedText(text) {
    const result = await genAI.models.embedContent({ model: "gemini-embedding-001", contents: text })
    return result.embedContent?.values
}

export async function embedChunks(chunks) {
    const embeddingChunks = []

    for (const chunk of chunks) {
        const embedding = await embedText(chunk.content);
        embedChunks.push({
            ...chunk,
            embedding

    })
        
    }
    return embedChunks
    
}