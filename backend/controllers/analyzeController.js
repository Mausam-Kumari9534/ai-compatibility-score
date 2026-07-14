const pdfService = require('../services/pdfService');
const geminiService = require('../services/geminiService');

exports.analyzeResume = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({ error: 'Resume PDF file is required.' });
        }
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required.' });
        }

        // 1. Extract text from PDF
        const resumeText = await pdfService.extractText(resumeFile.buffer);

        // 2. Send to Gemini for analysis
        const analysisResult = await geminiService.analyze(resumeText, jobDescription);

        // 3. Return JSON response
        res.json(analysisResult);
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'An error occurred while analyzing the resume.', details: error.message, stack: error.stack });
    }
};
