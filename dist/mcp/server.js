import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { alunoTools } from './tools/alunoTools.js';
import { cursoTools } from './tools/cursoTools.js';
import { turmaTools } from './tools/turmaTools.js';
import { pagamentoTools } from './tools/pagamentoTools.js';
import { authTools } from './tools/authTools.js';
const log = (msg, data) => {
    const timestamp = new Date().toISOString();
    const output = data
        ? `[${timestamp}] ${msg} ${JSON.stringify(data, null, 2)}`
        : `[${timestamp}] ${msg}`;
    console.error(output);
};
const sessions = new Map();
const allTools = [
    ...alunoTools,
    ...cursoTools,
    ...turmaTools,
    ...pagamentoTools,
    ...authTools,
];
const invalidTools = allTools
    .map((tool, index) => {
    const errors = [];
    if (!tool.name)
        errors.push('name undefined');
    if (!tool.description)
        errors.push('description undefined');
    if (!tool.inputSchema)
        errors.push('inputSchema undefined');
    if (!tool.handler)
        errors.push('handler undefined');
    if (errors.length > 0) {
        return { index, errors, tool };
    }
    return null;
})
    .filter(Boolean);
if (invalidTools.length > 0) {
    console.error('TOOLS INVÁLIDAS ENCONTRADAS:');
    invalidTools.forEach((t) => {
        console.error(`  Index ${t.index}: ${t.errors.join(', ')}`);
        console.error(`  Tool:`, JSON.stringify(t.tool, null, 2));
    });
    throw new Error(`Existem ${invalidTools.length} tools inválidas. Corrige antes de continuar.`);
}
console.log(`${allTools.length} tools carregadas com sucesso`);
allTools.forEach((t, i) => console.log(`  ${i}: ${t.name}`));
const server = new Server({ name: 'centro-formacao-mcp-server', version: '1.0.0' }, { capabilities: { tools: {} } });
// Tool especial para gestão de sessão
const sessionManagementTools = [
    {
        name: 'set_session_context',
        description: 'Define o contexto da sessão atual (uso interno)',
        inputSchema: {
            type: 'object',
            properties: {
                sessionId: { type: 'string' },
                userId: { type: 'string' },
                email: { type: 'string' },
                token: { type: 'string' },
            },
            required: ['sessionId'],
        },
        handler: async (args, extra) => {
            const { sessionId, ...context } = args;
            sessions.set(sessionId, {
                ...sessions.get(sessionId),
                ...context,
                lastActivity: new Date().toISOString(),
            });
            return {
                content: [{ type: 'text', text: 'Contexto atualizado' }],
            };
        },
    },
];
const allToolsWithSession = [...allTools, ...sessionManagementTools];
server.setRequestHandler(ListToolsRequestSchema, async () => {
    const publicTools = allTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
    }));
    return { tools: publicTools };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const sessionId = args?._sessionId || 'default';
    const userContext = args?._userContext || {};
    const currentContext = {
        sessionId,
        ...userContext,
        timestamp: new Date().toISOString(),
    };
    console.log(`[MCP] Tool: ${name} | Sessão: ${sessionId} | User: ${userContext.email || 'anónimo'}`);
    const tool = allToolsWithSession.find((t) => t.name === name);
    if (!tool) {
        throw new Error(`Tool não encontrada: ${name}`);
    }
    try {
        const result = await tool.handler({
            ...args,
            context: currentContext,
            sessionId,
            userContext: currentContext,
        }, { context: currentContext });
        return result;
    }
    catch (error) {
        console.error(`[MCP] Erro em ${name}:`, error);
        throw error;
    }
});
const transport = new StdioServerTransport();
await server.connect(transport);
log('Servidor MCP conectado e pronto!');
log(`Tools carregadas: ${allTools.length}`);
//# sourceMappingURL=server.js.map