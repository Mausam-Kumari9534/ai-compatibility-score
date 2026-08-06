const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini client
// Assumes GEMINI_API_KEY is set in environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model fallback chain: Try preferred models first, then stable/older models
const MODELS_TO_TRY = [
    'gemini-3-flash-preview',
    'gemini-3-pro-preview',
    'gemini-3.5-flash',
    'gemini-flash-latest'
];

exports.analyze = async (resumeText, jobDescription) => {
    const prompt = `
You are an expert AI recruiter and career assistant for students.
Compare the following Resume Text with the Job Description.

Return ONLY a valid JSON object matching exactly this structure (no markdown, no explanations, no code blocks around it, just raw JSON):
{
  "matchScore": number (0-100),
  "matchingSkills": [ "skill1", "skill2" ],
  "missingKeywords": [ "keyword1", "keyword2" ],
  "summary": "Short 1-2 sentence summary of compatibility",
  "suggestions": [ "suggestion1", "suggestion2" ],
  "eligibility": {
    "status": "Eligible" | "Partially Eligible" | "Not Eligible",
    "checks": [ { "requirement": "e.g., Degree Eligible", "status": true | false } ]
  },
  "atsBreakdown": {
    "format": number, "technical": number, "projects": number, "education": number, "keyword": number, "softSkills": number
  },
  "skillsMatch": [
    { "skill": "string", "status": true | false }
  ],
  "missingSkills": [
    { "skill": "string", "priority": "Critical" | "Important" | "Optional" }
  ],

  "actionPlan": [
    { "priority": number, "action": "string", "reason": "string", "impact": "string", "time": "string" }
  ],
  "scorePrediction": {
    "current": number, "afterResume": number, "afterSkills": number
  },
  "rewrites": [
    { "before": "string", "after": "string" }
  ],
  "verdict": {
    "interviewChance": number, "opinion": "string"
  },
  "applyDecision": {
    "decision": "YES" | "APPLY AFTER UPDATING RESUME" | "NO",
    "reason": "string"
  },
  "nextSteps": [ "string" ],
  "resumeHighlights": [
    { "section": "string", "feedback": "string", "status": "Green" | "Yellow" | "Red" }
  ],
  "keywordDensity": [
    { "keyword": "string", "mentions": number, "status": true | false }
  ],
  "recruiterReview": {
    "strengths": [ "string" ], "weaknesses": [ "string" ], "finalRecommendation": "string"
  },
  "interviewPrep": [
    { "category": "Technical" | "HR" | "Project" | "Coding", "question": "string", "difficulty": "Easy" | "Medium" | "Hard" }
  ],
  "learningResources": [
    { "skill": "string", "resources": ["string", "string"], "estimatedTime": "string" }
  ],
  "companyFit": {
    "best": ["string"], "average": ["string"], "needsImprovement": ["string"], "explanation": "string"
  },
  "timeline": [
    { "step": "string", "duration": "string" }
  ],
  "careerSummary": {
    "readiness": number, "suitableRoles": ["string"], "salaryRange": "string", "overallRecommendation": "string"
  }
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
    console.error('[Gemini] All models failed. Throwing error.');
    
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

    const err = new Error(errorMessage);
    err.status = status || 500;
    throw err;
};
