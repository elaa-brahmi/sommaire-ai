import { GoogleGenerativeAI } from '@google/generative-ai';
import { SUMMARY_SYSTEM_PROMPT } from '../utils/prompts';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
export const generateSummaryFromGemini = async (pdfText: string) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
            generationConfig:{
                temperature:0.7,
                maxOutputTokens:1500, //to not loose our credits
            },
         });
         const prompt = {
            contents: [
            {
            role: 'user',
            parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
            text: `Transform this document into an
            engaging, easy-to-read summary with
            contextually relevant emojis and proper
            markdown formatting:\n\n${pdfText}`,
            
            },
            
            ],},],};
        const result = await model.generateContent(prompt);
        const response = await result.response;
        if(!response.text()){
            throw new Error('empty response from gemini api');
        }
        return response.text();
        } 
        catch (error) {
        console.error("Full error object:", error);
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            
            if (error.message.includes('429')) {
                console.log("RATE_LIMIT_EXCEEDED")
                throw new Error("RATE_LIMIT_EXCEEDED");
            }
        }
        throw error;
    }
};