import { genAI, convertToGeminiTools } from './geminiClient.js';
import { MCPClient } from '../client.js';

export class GeminiAgent {
  private mcpClient!: MCPClient;
  private model: any;
  private tools: any[] = [];
  private serverPath: string;
  private isInitialized: boolean = false;
  private currentContext: any = {};

  constructor(serverPath: string) {
    this.serverPath = serverPath;
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
  }

  async initialize() {
    if (this.isInitialized) return;

    this.mcpClient = new MCPClient(this.serverPath);
    await this.mcpClient.connect();

    const mcpTools = await this.mcpClient.getTools();
    this.tools = convertToGeminiTools(mcpTools);

    console.log(`[GeminiAgent] ${mcpTools.length} tools carregadas`);
    this.isInitialized = true;
  }

  async chat(userMessage: string, userContext?: {
    userId: string;
    email: string;
    token?: string;
  }): Promise<string> {
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

    const functionResponses = await Promise.all(
      functionCalls.map(async (call: any) => {
        console.log(`[Gemini] Chamando ${call.name}:`, call.args);

        // Usar callTool com contexto correto
        const result = await this.mcpClient.callTool(
          call.name,
          call.args as Record<string, unknown>
        );

        return {
          functionResponse: {
            name: call.name,
            response: result,
          },
        };
      })
    );

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