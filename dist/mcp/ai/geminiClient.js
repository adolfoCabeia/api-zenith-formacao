import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export { genAI };
export function convertToGeminiTools(mcpTools) {
    const functionDeclarations = mcpTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
    }));
    return [{ functionDeclarations }];
}
//# sourceMappingURL=geminiClient.js.map