export default function chunkPages(pages, chunkSize = 800, overlap = 150) {
  const allChunks = [];
  let idx = 0;

  for (const { pageNumber, text } of pages) {
    const clean = text.replace(/\s+/g, " ").trim();
    let start = 0;

    while (start < clean.length) {
      const content = clean.slice(start, start + chunkSize).trim();
      if (content) allChunks.push({ pageNumber, chunkIndex: idx++, content });
      start += chunkSize - overlap;
    }
  }

  return allChunks;
}