import fs from 'fs'
import { PDFParse } from 'pdf-parse'

export const ExtractTextFromPDF = async (filepath) => {
    try {
        const dataParser = fs.readFileSync(filepath)
        const parser = new PDFParse({ data: dataParser});

        const result = await parser.getText();
        return splitIntoPages(result.text)

    } catch (error) {
        return error.message

    }
}


function splitIntoPages(fullText) {
    const pageMarkerRegex = /--\s*(\d+)\s*of\s*(\d+)\s*--/g;

    const pages = [];
    let lastIndex = 0;
    let match;

    while ((match = pageMarkerRegex.exec(fullText)) !== null) {
        const pageNumber = parseInt(match[1], 10);
        const pageText = fullText.slice(lastIndex, match.index).trim();

        pages.push({
            pageNumber,
            text: pageText,
        });

        lastIndex = pageMarkerRegex.lastIndex;
    }

    // Agar marker ke baad bhi kuch text bacha ho (last page jiska marker na ho)
    const remaining = fullText.slice(lastIndex).trim();
    if (remaining) {
        pages.push({
            pageNumber: pages.length + 1,
            text: remaining,
        });
    }

    return pages;
}