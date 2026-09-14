
function splitTextIntoChunks(text, chunkSize = 800, overlap = 150) {
  const chunks = [];
  let start = 0;

  const cleanedText = text.replace(/\s+/g, " ").trim();

  if (cleanedText.length === 0) return chunks;

  while (start < cleanedText.length) {
    const end = start + chunkSize;
    const chunkText = cleanedText.slice(start, end).trim();

    if (chunkText.length > 0) {
      chunks.push(chunkText);
    }

    start += chunkSize - overlap;
  }

  return chunks;
}

export default function chunkPages(pages, chunkSize = 800, overlap = 150) {
  const allChunks = [];
  let globalChunkIndex = 0;

  for (const page of pages) {
    const textChunks = splitTextIntoChunks(page.text, chunkSize, overlap);

    for (const chunkText of textChunks) {
      allChunks.push({
        pageNumber: page.pageNumber,
        chunkIndex: globalChunkIndex,
        content: chunkText,
      });
      globalChunkIndex++;
    }
  }

  return allChunks;
}