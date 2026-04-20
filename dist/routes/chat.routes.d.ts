/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: Endpoints para chat com IA que permite interagir com o sistema de gestão do centro de formação através de linguagem natural
 *   - name: Tools MCP
 *     description: Tools disponíveis via Model Context Protocol (MCP) para operações CRUD em alunos, cursos, turmas e pagamentos
 */
declare const chatRouter: import("express-serve-static-core").Router;
/**
 * @swagger
 * /chat/tools:
 *   get:
 *     summary: Lista todas as tools MCP disponíveis
 *     description: Retorna a lista completa de ferramentas disponíveis no servidor MCP para operações no sistema
 *     tags: [Tools MCP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tools obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 tools:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "criar_aluno"
 *                       description:
 *                         type: string
 *                         example: "Cria um novo aluno no sistema com upload de documentos"
 *       503:
 *         description: Agente não inicializado
 *       500:
 *         description: Erro ao obter tools
 */
export default chatRouter;
//# sourceMappingURL=chat.routes.d.ts.map