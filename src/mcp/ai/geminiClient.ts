import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export { genAI };

type FunctionDeclaration = {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
};

type Tool = {
  functionDeclarations: FunctionDeclaration[];
};

export function convertToGeminiTools(mcpTools: any[]): Tool[] {
  const functionDeclarations: FunctionDeclaration[] = mcpTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema,
  }));

  return [{ functionDeclarations }];
}