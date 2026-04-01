import { Router } from 'express';
import { GeminiAgent } from '../mcp/ai/geminiAgents.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: Endpoints para chat com IA que permite interagir com o sistema de gestão do centro de formação através de linguagem natural
 *   - name: Tools MCP
 *     description: Tools disponíveis via Model Context Protocol (MCP) para operações CRUD em alunos, cursos, turmas e pagamentos
 */

const chatRouter = Router();
const agent = new GeminiAgent('./src/mcp/server.ts');

let agentReady = false;
agent.initialize().then(() => {
  agentReady = true;
  console.log('[Chat] Agente pronto para receber mensagens');
});

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Envia uma mensagem para o agente IA e recebe resposta
 *     description: |
 *       Endpoint principal para interação com o assistente IA. O agente utiliza o Model Context Protocol (MCP) 
 *       para executar operações no sistema através de linguagem natural.
 *       
 *       ## 🛠️ Tools Disponíveis
 *       
 *       ### 👤 Alunos (5 tools)
 *       | Tool | Descrição | Permissão |
 *       |------|-----------|-----------|
 *       | `listar_alunos` | Lista todos os alunos cadastrados | Todos |
 *       | `buscar_aluno` | Busca aluno por ID | Todos |
 *       | `criar_aluno` | Cadastra novo aluno com documentos | Admin |
 *       | `atualizar_aluno` | Atualiza dados do aluno | Admin |
 *       | `deletar_aluno` | Remove aluno do sistema | Admin |
 *       
 *       ### 📚 Cursos (5 tools)
 *       | Tool | Descrição | Permissão |
 *       |------|-----------|-----------|
 *       | `listar_cursos` | Lista todos os cursos | Todos |
 *       | `buscar_curso` | Busca curso por ID | Todos |
 *       | `criar_curso` | Cria novo curso | Admin |
 *       | `atualizar_curso` | Atualiza dados do curso | Admin |
 *       | `deletar_curso` | Remove curso | Admin |
 *       
 *       ### 📅 Turmas (5 tools)
 *       | Tool | Descrição | Permissão |
 *       |------|-----------|-----------|
 *       | `listar_turmas` | Lista todas as turmas | Todos |
 *       | `buscar_turma` | Busca turma por ID | Todos |
 *       | `criar_turma` | Cria nova turma | Admin |
 *       | `atualizar_turma` | Atualiza dados da turma | Admin |
 *       | `deletar_turma` | Remove turma | Admin |
 *       
 *       ### 💰 Pagamentos (5 tools)
 *       | Tool | Descrição | Permissão |
 *       |------|-----------|-----------|
 *       | `listar_pagamentos` | Lista todos os pagamentos | Todos |
 *       | `buscar_pagamento` | Busca pagamento por ID | Todos |
 *       | `criar_pagamento` | Registra novo pagamento | Admin |
 *       | `atualizar_pagamento` | Atualiza status/valor | Admin |
 *       | `deletar_pagamento` | Remove registro | Admin |
 *       
 *       ## 💬 Exemplos de Mensagens
 *       
 *       ### Listar (READ)
 *       - `"Liste todos os alunos"`
 *       - `"Mostre-me os cursos disponíveis"`
 *       - `"Quais são as turmas deste mês?"`
 *       - `"Liste pagamentos pendentes"`
 *       
 *       ### Buscar (READ ONE)
 *       - `"Busque o aluno com ID abc-123"`
 *       - `"Encontre o curso de Python"`
 *       - `"Detalhes da turma xyz-789"`
 *       - `"Procure pagamento do aluno João Silva"`
 *       
 *       ### Criar (CREATE)
 *       **Aluno:**
 *       - `"Cadastre o aluno João Silva, email joao@teste.com, telefone 923456789, turma ID xyz"`
 *       - `"Novo aluno: Maria Santos, maria@email.com, 912345678, turma abc"`
 *       
 *       **Curso:**
 *       - `"Crie curso Python Básico por 50000 KZ"`
 *       - `"Novo curso: Excel Avançado, preço 45000"`
 *       - `"Adicionar curso Web Design custando 60000"`
 *       
 *       **Turma:**
 *       - `"Crie turma para curso abc, Segunda-feira, 19:00-21:00, início 15/04/2025, fim 15/07/2025, 20 vagas"`
 *       - `"Nova turma: curso xyz, Sábado, 09:00-13:00, capacidade 15"`
 *       
 *       **Pagamento:**
 *       - `"Registre pagamento de 25000 do aluno abc, status pago"`
 *       - `"Novo pagamento: aluno xyz, valor 50000, pendente"`
 *       
 *       ### Atualizar (UPDATE)
 *       **Aluno:**
 *       - `"Atualize aluno abc, mude telefone para 999888777"`
 *       - `"Mude email do aluno xyz para novo@email.com"`
 *       - `"Atualize status do aluno abc para inativo"`
 *       
 *       **Curso:**
 *       - `"Mude preço do curso abc para 55000"`
 *       - `"Atualize nome do curso xyz para Python Avançado"`
 *       
 *       **Turma:**
 *       - `"Mude horário da turma abc para 20:00-22:00"`
 *       - `"Atualize capacidade da turma xyz para 25 alunos"`
 *       
 *       **Pagamento:**
 *       - `"Mude status do pagamento abc para pago"`
 *       - `"Atualize valor do pagamento xyz para 30000"`
 *       
 *       ### Deletar (DELETE)
 *       - `"Remova o aluno com ID abc-123"`
 *       - `"Delete curso xyz"`
 *       - `"Exclua turma abc"`
 *       - `"Remova pagamento xyz"`
 *       
 *       ## ⚠️ Notas Importantes
 *       
 *       - **Datas**: Use formato ISO (2025-04-15) ou descreva ("15 de abril de 2025")
 *       - **Preços**: Sempre em Kwanzas (KZ), apenas números (50000)
 *       - **IDs**: UUIDs gerados automaticamente, use-os para operações específicas
 *       - **Uploads**: Para criar aluno com documentos, use o endpoint específico de upload
 *       - **Contexto**: O agente mantém contexto do utilizador autenticado
 *       
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensagem em linguagem natural para o agente IA executar operações no sistema
 *                 minLength: 1
 *                 maxLength: 1000
 *                 examples:
 *                   listar:
 *                     value: "Liste todos os alunos"
 *                     summary: Listar todos os alunos
 *                   buscar:
 *                     value: "Busque o aluno com ID 550e8400-e29b-41d4-a716-446655440000"
 *                     summary: Buscar aluno específico
 *                   criar:
 *                     value: "Crie curso Python Básico por 50000 KZ"
 *                     summary: Criar novo curso
 *                   atualizar:
 *                     value: "Atualize o preço do curso abc-123 para 55000"
 *                     summary: Atualizar curso existente
 *                   deletar:
 *                     value: "Delete o aluno com ID xyz-789"
 *                     summary: Remover aluno
 *             required:
 *               - message
 *           examples:
 *             listar_alunos:
 *               summary: Listar todos os alunos
 *               value:
 *                 message: "Liste todos os alunos cadastrados"
 *             criar_curso:
 *               summary: Criar novo curso
 *               value:
 *                 message: "Crie um curso de Python básico com preço de 50000 kz"
 *             criar_aluno:
 *               summary: Cadastrar novo aluno
 *               value:
 *                 message: "Cadastre o aluno João Silva, email joao@teste.com, telefone 923456789, turma ID 550e8400-e29b-41d4-a716-446655440000"
 *             criar_turma:
 *               summary: Criar nova turma
 *               value:
 *                 message: "Crie turma para curso 550e8400-e29b-41d4-a716-446655440000, Segunda-feira, 19:00-21:00, início 2025-04-15, fim 2025-07-15, 20 vagas"
 *             atualizar_status:
 *               summary: Atualizar status
 *               value:
 *                 message: "Mude o status do aluno 550e8400-e29b-41d4-a716-446655440000 para inativo"
 *     responses:
 *       200:
 *         description: Operação executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Resposta formatada do agente IA com resultado da operação
 *                   examples:
 *                     listar:
 *                       value: "👥 Alunos cadastrados (3 total):\n\n1. João Silva (joao@teste.com) - 923456789 | Status: ativo | Turma: Python Básico\n2. Maria Santos (maria@email.com) - 912345678 | Status: ativo | Turma: Excel Avançado"
 *                     criar:
 *                       value: "✅ Curso 'Python Básico' criado com sucesso!\n\nID: 550e8400-e29b-41d4-a716-446655440000\nPreço: 50000 KZ"
 *                     erro:
 *                       value: "❌ Erro: Curso com este nome já existe"
 *       400:
 *         description: Requisição inválida - mensagem não fornecida ou vazia
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Mensagem obrigatória"
 *       401:
 *         description: Não autorizado - token JWT inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido"
 *       503:
 *         description: Serviço indisponível - agente MCP ainda inicializando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Agente ainda inicializando"
 *       500:
 *         description: Erro interno do servidor ou falha na execução da tool MCP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro na comunicação com o servidor MCP"
 */

chatRouter.post('/chat', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!agentReady) {
      return res.status(503).json({ error: 'Agente ainda inicializando' });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem obrigatória' });
    }

    const user = req.user; 

    const response = await agent.chat(message, {
      userId: user.id,
      email: user.email
    });

    res.json({
      success: true,
      message: response,
    });

  } catch (error: any) {
    res.status(500).json({
      error: error.message
    });
  }
});

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

// Endpoint opcional para listar tools (adicionar se necessário)
// chatRouter.get('/chat/tools', authMiddleware, async (req, res) => { ... });

export default chatRouter;