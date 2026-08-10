const geminiService = require('../services/geminiService');

exports.optimizeResume = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'resumeText and jobDescription are required.' });
        }

        const optimizedResult = await geminiService.optimizeResume(resumeText, jobDescription);
        res.json(optimizedResult);
    } catch (error) {
        console.error('Error optimizing resume:', error);
        res.status(500).json({ error: error.message || 'An error occurred while optimizing the resume.' });
    }
};

exports.generateCoverLetter = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'resumeText and jobDescription are required.' });
        }

        const coverLetter = await geminiService.generateCoverLetter(resumeText, jobDescription);
        res.json({ coverLetter });
    } catch (error) {
        console.error('Error generating cover letter:', error);
        res.status(500).json({ error: error.message || 'An error occurred while generating the cover letter.' });
    }
};

exports.prepareInterview = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'resumeText and jobDescription are required.' });
        }

        const interviewData = await geminiService.generateInterviewQuestions(resumeText, jobDescription);
        res.json(interviewData);
    } catch (error) {
        console.error('Error generating interview prep:', error);
        res.status(500).json({ error: error.message || 'An error occurred while preparing interview questions.' });
    }
};
