const { PDFParse } = require('pdf-parse');

exports.extractText = async (dataBuffer) => {
    try {
        // Convert Buffer to Uint8Array as required by pdf-parse ^2.4.5
        const uint8Array = new Uint8Array(dataBuffer);
        const parser = new PDFParse(uint8Array);
        const result = await parser.getText();
        return result.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
};
