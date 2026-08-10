const Resume = require('../models/Resume');
const builderGeminiService = require('../services/builderGeminiService');
const pdfService = require('../services/pdfService');

exports.getDrafts = async (req, res) => {
    try {
        const drafts = await Resume.find({ user: req.user.id }).sort('-updatedAt');
        res.json(drafts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.saveDraft = async (req, res) => {
    try {
        const { id, title, template, personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = req.body;
        
        let resume;
        if (id) {
            resume = await Resume.findOneAndUpdate(
                { _id: id, user: req.user.id },
                { title, template, personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages },
                { new: true }
            );
        } else {
            resume = await Resume.create({
                user: req.user.id, title, template, personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages
            });
        }
        res.json(resume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.deleteDraft = async (req, res) => {
    try {
        await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.aiRewrite = async (req, res) => {
    try {
        const { text, context, type } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });
        const rewritten = await builderGeminiService.rewriteText(text, context, type);
        res.json({ rewritten });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

exports.aiSuggest = async (req, res) => {
    try {
        const resumeData = req.body.resumeData;
        const suggestions = await builderGeminiService.suggestImprovements(resumeData);
        res.json({ suggestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

exports.autoFill = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }
        const resumeText = await pdfService.extractText(req.file.buffer);
        const parsedData = await builderGeminiService.parseResumeToJSON(resumeText);
        res.json(parsedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};
