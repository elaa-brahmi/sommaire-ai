import { GoogleGenerativeAI } from '@google/generative-ai';
import { SUMMARY_SYSTEM_PROMPT } from '../utils/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const listGenerativeModels = async () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined");
    }

    try {
        // Use REST API to list models
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Filter for models that support generateContent
        const generativeModels = data.models.filter((model: any) => 
            model.supportedGenerationMethods?.includes('generateContent')
        );
        
        console.log("\n=== Models supporting generateContent ===");
        generativeModels.forEach((model: any) => {
            console.log(`✓ ${model.name.replace('models/', '')} - ${model.displayName}`);
        });
        console.log("=========================================\n");
        
        return generativeModels.map((m: any) => m.name.replace('models/', ''));
        
    } catch (error) {
        console.error("Error listing models:", error);
        return []; // Return empty array on error
    }
};

export const generateSummaryFromGemini = async (pdfText: string) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    
    try {
        // Get available models first
        console.log("🔍 Checking available models...");
        const availableModels = await listGenerativeModels();
        
        if (availableModels.length === 0) {
            throw new Error("No models available. Please check your API key.");
        }
        
        // Preferred models in order (try these first)
        const preferredModels = [
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro-latest", 
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro"
        ];
        
        // Find first available model from preferred list
        let selectedModel = preferredModels.find(preferred => 
            availableModels.some(available => available === preferred)
        );
        
        // If no preferred model found, use first available
        if (!selectedModel) {
            selectedModel = availableModels[0];
            console.log(`⚠️ None of the preferred models available. Using: ${selectedModel}`);
        } else {
            console.log(`✅ Using model: ${selectedModel}`);
        }

        const model = genAI.getGenerativeModel({ 
            model: selectedModel,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500,
            },
        });
        
        const prompt = {
            contents: [{
                role: 'user',
                parts: [
                    { text: SUMMARY_SYSTEM_PROMPT },
                    {
                        text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
                    },
                ],
            }],
        };
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        if (!response.text()) {
            throw new Error('Empty response from Gemini API');
        }
        
        return response.text();
        
    } catch (error) {
        console.error("Full error object:", error);
        
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            
            if (error.message.includes('429')) {
                console.log("RATE_LIMIT_EXCEEDED");
                throw new Error("RATE_LIMIT_EXCEEDED");
            }
            
            if (error.message.includes('404')) {
                console.log("MODEL_NOT_FOUND");
                throw new Error("MODEL_NOT_FOUND: The specified model is not available for your API key");
            }
        }
        throw error;
    }
};