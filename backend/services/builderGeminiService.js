const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODELS_TO_TRY = ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-3.5-flash'];

async function executeGemini(prompt) {
    let primaryError = null;
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`[Builder Gemini] Attempting with model: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let text = response.text;
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return text;
        } catch (error) {
            console.error(`[Builder Gemini] Model ${modelName} failed:`, error.message);
            if (error.status === 401) break;
            if (!primaryError || error.status === 429 || error.status === 503) {
                primaryError = error;
            }
        }
    }
    throw new Error("AI service unavailable.");
}

exports.rewriteText = async (text, context, type) => {
    const prompt = `
You are an expert ATS resume writer.
I will give you a piece of text from a resume section (${type}).
Rewrite it to be highly professional, impactful, and ATS-friendly. Use strong action verbs and quantify achievements if possible.
Do not add completely fabricated information, just improve the phrasing drastically.

Original Text:
${text}

Context/Additional Info:
${context || 'None'}

Return ONLY the rewritten text. No explanations, no quotation marks around it, just the raw string.
`;
    return await executeGemini(prompt);
};

exports.suggestImprovements = async (resumeData) => {
    const prompt = `
You are an expert AI Career Coach. Review the following JSON resume data.
Generate 5 practical suggestions to improve it.
Return ONLY a valid JSON array of strings: ["suggestion 1", "suggestion 2", ...]

Resume Data:
${JSON.stringify(resumeData)}
`;
    const result = await executeGemini(prompt);
    return JSON.parse(result);
};

exports.parseResumeToJSON = async (rawText) => {
    const prompt = `
You are an expert resume parser. Read the raw text below and extract it into a structured JSON format.
Return ONLY a valid JSON object with the following structure (no markdown, no explanations):

{
    "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "portfolio": "" },
    "summary": "String",
    "experience": [ { "id": "generate_unique_string", "jobTitle": "", "company": "", "startDate": "", "endDate": "", "location": "", "description": "" } ],
    "education": [ { "id": "generate_unique_string", "degree": "", "institution": "", "startDate": "", "endDate": "", "score": "" } ],
    "projects": [ { "id": "generate_unique_string", "title": "", "technologies": "", "link": "", "description": "" } ],
    "skills": { "technical": "", "soft": "" },
    "certifications": [ { "id": "generate_unique_string", "name": "", "issuer": "", "date": "" } ],
    "achievements": "String",
    "languages": "String"
}

Raw Text:
${rawText}
`;
    const result = await executeGemini(prompt);
    return JSON.parse(result);
};
