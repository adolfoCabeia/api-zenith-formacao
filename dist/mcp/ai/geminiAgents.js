import { genAI, convertToGeminiTools } from './geminiClient.js';
import { MCPClient } from '../client.js';
export class GeminiAgent {
    mcpClient;
    model;
    tools = [];
    serverPath;
    isInitialized = false;
    currentContext = {};
    constructor(serverPath) {
        this.serverPath = serverPath;
        this.model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
        });
    }
    async initialize() {
        if (this.isInitialized)
            return;
        this.mcpClient = new MCPClient(this.serverPath);
        await this.mcpClient.connect();
        const mcpTools = await this.mcpClient.getTools();
        this.tools = convertToGeminiTools(mcpTools);
        console.log(`[GeminiAgent] ${mcpTools.length} tools carregadas`);
        this.isInitialized = true;
    }
    async chat(userMessage, userContext) {
        if (!this.isInitialized) {
            throw new Error('Agente não inicializado. Chame initialize() primeiro.');
        }
        this.currentContext = {
            ...userContext,
            authenticated: !!userContext?.userId,
            timestamp: new Date().toISOString()
        };
        const chat = this.model.startChat({
            tools: this.tools,
        });
        const enrichedMessage = userContext
            ? `[Contexto: Utilizador ${userContext.email} (ID: ${userContext.userId})]\n${userMessage}`
            : userMessage;
        const result = await chat.sendMessage(enrichedMessage);
        const response = result.response;
        const functionCalls = response.functionCalls?.();
        if (!functionCalls || functionCalls.length === 0) {
            return response.text();
        }
        const functionResponses = await Promise.all(functionCalls.map(async (call) => {
            console.log(`[Gemini] Chamando ${call.name}:`, call.args);
            // Usar callTool com contexto correto
            const result = await this.mcpClient.callTool(call.name, call.args);
            return {
                functionResponse: {
                    name: call.name,
                    response: result,
                },
            };
        }));
        const finalResult = await chat.sendMessage(functionResponses);
        return finalResult.response.text();
    }
    // Método para aceder ao cliente MCP (útil para testes)
    getMcpClient() {
        return this.mcpClient;
    }
    async destroy() {
        if (this.mcpClient) {
            await this.mcpClient.disconnect();
        }
        this.isInitialized = false;
    }
}
//# sourceMappingURL=geminiAgents.js.map