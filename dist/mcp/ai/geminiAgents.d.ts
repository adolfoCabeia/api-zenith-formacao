import { MCPClient } from '../client.js';
export declare class GeminiAgent {
    private mcpClient;
    private model;
    private tools;
    private serverPath;
    private isInitialized;
    private currentContext;
    constructor(serverPath: string);
    initialize(): Promise<void>;
    chat(userMessage: string, userContext?: {
        userId: string;
        email: string;
        token?: string;
    }): Promise<string>;
    getMcpClient(): MCPClient;
    destroy(): Promise<void>;
}
//# sourceMappingURL=geminiAgents.d.ts.map