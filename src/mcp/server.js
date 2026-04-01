import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { alunoTools } from './tools/alunoTools.js';
const server = new Server({
    name: 'aluno-mcp-server',
    version: '1.0.0',
});
server.setRequestHandler('tools/list', async () => {
    return {
        tools: alunoTools,
    };
});
server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params;
    const tool = alunoTools.find(t => t.name === name);
    if (!tool) {
        throw new Error('Tool não encontrada');
    }
    return tool.handler(args);
});
const transport = new StdioServerTransport();
server.connect(transport);
//# sourceMappingURL=server.js.map