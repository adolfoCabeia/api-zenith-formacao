import { GoogleGenerativeAI } from '@google/generative-ai';
declare const genAI: GoogleGenerativeAI;
export { genAI };
type FunctionDeclaration = {
    name: string;
    description: string;
    parameters?: Record<string, unknown>;
};
type Tool = {
    functionDeclarations: FunctionDeclaration[];
};
export declare function convertToGeminiTools(mcpTools: any[]): Tool[];
//# sourceMappingURL=geminiClient.d.ts.map