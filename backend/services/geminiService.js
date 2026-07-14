const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini client
// Assumes GEMINI_API_KEY is set in environment variables
const ai = new GoogleGenAI({});

// Model fallback chain: Try preferred models first, then stable/older models
const MODELS_TO_TRY = [
    'gemini-3.1-pro',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
];

exports.analyze = async (resumeText, jobDescription) => {
    const prompt = `
You are an expert AI recruiter and resume analyzer.
Compare the following Resume Text with the Job Description.

Return ONLY a valid JSON object matching exactly this structure (no markdown, no explanations, no code blocks around it, just raw JSON):
{
  "matchScore": number (0-100),
  "matchingSkills": [ array of strings ],
  "missingKeywords": [ array of strings ],
  "summary": "Short 1-2 sentence summary of compatibility",
  "suggestions": [ array of strings for improvement ]
}

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

    let primaryError = null;

    // Try each model in sequence
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`[Gemini] Attempting analysis with model: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });

            let text = response.text;
            
            // Clean up markdown if Gemini accidentally adds it
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const result = JSON.parse(text);
            console.log(`[Gemini] Successfully generated response using ${modelName}`);
            return result;
            
        } catch (error) {
            const status = error.status || (error.response && error.response.status) || 500;
            console.error(`[Gemini] Model ${modelName} failed with status ${status}:`, error.message);
            
            // If the API key is invalid (401), trying other models will also fail, so we break early.
            if (status === 401) {
                primaryError = error;
                break;
            }
            
            // Prioritize 429 (Quota) over 404 (Not Found) for the final error message
            if (!primaryError || status === 429 || status === 503 || status === 500) {
                primaryError = error;
            }
        }
    }

    // If we reach here, all fallback models failed.
    console.error('[Gemini] All models failed. Returning graceful fallback to UI.');
    
    let errorMessage = "An unexpected error occurred during AI analysis.";
    const status = primaryError?.status || (primaryError?.response && primaryError?.response?.status);
    const msg = primaryError?.message || "";

    if (status === 401 || msg.includes('401') || msg.toLowerCase().includes('api key')) {
        errorMessage = "AI analysis is unavailable because the configured Gemini API key is invalid or missing.";
    } else if (status === 429 || msg.includes('429') || msg.toLowerCase().includes('quota')) {
        errorMessage = "AI analysis is temporarily unavailable because the Gemini API quota has been exceeded. Please try again later or use a different API key.";
    } else if (status === 404 || msg.includes('404')) {
        errorMessage = "AI analysis is unavailable because the requested AI models are not supported for this account.";
    } else if (status === 503 || msg.includes('503') || msg.toLowerCase().includes('high demand')) {
        errorMessage = "AI analysis is temporarily unavailable due to high API demand. Please try again later.";
    } else {
        errorMessage = "AI analysis is temporarily unavailable due to an internal server error. Please try again later.";
    }

    // Graceful fallback to prevent HTTP 500 and return a 200 OK response 
    return {
        matchScore: 0,
        matchingSkills: [],
        missingKeywords: ["N/A"],
        summary: errorMessage,
        suggestions: []
    };
};
