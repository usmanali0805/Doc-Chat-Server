import genAI from "../config/gemini";

const model = genAI.getGenverativeModel({model : "text-embedding-004"});

export async function embedText(text) {
    const result = await model.embedContent(text)
    return result.embedContent.values
}

export async function embedChunks(chunks) {
    const embeddingChunks = []

    for (const chunk of chunks) {
        const embedding = await embedText(chunk.content);
        embedChunks.push([
            ...chunk,
            embedding

        ])
        
    }
    return embedChunks
    
}