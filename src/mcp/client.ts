import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { randomUUID } from 'crypto';

export class MCPClient {
  private client: Client;
  private transport: StdioClientTransport;
  private sessionId: string;
  private context: any = {};

  constructor(serverScriptPath: string) {
    this.sessionId = randomUUID();
    
    this.transport = new StdioClientTransport({
      command: 'npx',
      args: ['tsx', serverScriptPath],
      env: {
        ...process.env,
        MCP_SESSION_ID: this.sessionId
      }
    });

    this.client = new Client({
      name: 'app-client',
      version: '1.0.0',
    });
  }

  async connect() {
    await this.client.connect(this.transport);
    console.log('[MCP] Cliente conectado | Sessão:', this.sessionId);
  }

  async getTools() {
    const { tools } = await this.client.listTools();
    return tools;
  }

  async setContext(context: any) {
    this.context = { ...this.context, ...context };
  
    try {
      await this.callTool('set_session_context', {
        sessionId: this.sessionId,
        userId: context.userId,
        email: context.email,
        token: context.token
      });
    } catch (e) {
      console.log('[MCP] Contexto guardado localmente');
    }
  }

  getContext() {
    return this.context;
  }

  getSessionId() {
    return this.sessionId;
  }

  async callTool(name: string, args: Record<string, unknown>) {
    console.log(`[MCP] Chamando ${name}:`, args);
  
    const result = await this.client.callTool({ 
      name, 
      arguments: {
        ...args,
        _sessionId: this.sessionId
      }
    });
    return result;
  }

  async disconnect() {
    await this.client.close();
  }
}