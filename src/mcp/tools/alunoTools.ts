import AlunoService from '../../services/aluno.service.js';

const createResponse = (data: any, isError = false) => ({
  content: [
    {
      type: 'text' as const,
      text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    },
  ],
  isError,
});

const handleError = (error: any) => {
  console.error('[AlunoTools] Erro:', error);
  const message = error instanceof Error ? error.message : 'Erro desconhecido';
  return createResponse(`Erro: ${message}`, true);
};

export const alunoTools = [
  {
    name: 'listar_alunos',
    description: 'Lista todos os alunos cadastrados no sistema em formato legível',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: async (args: any, extra: any) => {
      try {
        console.log('[listar_alunos] Contexto:', extra?.context?.email || 'sem contexto');

        const alunos = await AlunoService.findAll();

        if (!alunos || alunos.length === 0) {
          return {
            content: [{
              type: 'text',
              text: 'Não existem alunos cadastrados no sistema.'
            }]
          };
        }
        
        const lista = alunos.map((a, i) => {
          const turmaNome = a.turma?.curso?.nome || 'Sem turma';
          return `${i + 1}. ${a.nome} (${a.email}) - ${a.telefone} | Status: ${a.status} | Turma: ${turmaNome}`;
        }).join('\n');

        const texto = `Alunos cadastrados (${alunos.length} total):\n\n${lista}`;

        return {
          content: [{
            type: 'text',
            text: texto
          }]
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },

  {
    name: 'buscar_aluno',
    description: 'Busca um aluno específico pelo ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID único do aluno (UUID)'
        },
      },
      required: ['id'],
    },
    handler: async (input: { id: string }) => {
      try {
        if (!input.id || input.id.trim() === '') {
          return createResponse('ID do aluno é obrigatório', true);
        }

        const aluno = await AlunoService.findById(input.id);

        if (!aluno) {
          return createResponse(`Aluno com ID "${input.id}" não encontrado`, true);
        }

        const simplified = {
          id: aluno.id,
          nome: aluno.nome,
          email: aluno.email,
          telefone: aluno.telefone,
          status: aluno.status,
          turma: aluno.turma?.curso?.nome || 'Sem turma',
          biUrl: aluno.biUrl,
          comprovativoUrl: aluno.comprovativoUrl,
          createdAt: aluno.createdAt,
          updatedAt: aluno.updatedAt,
        };

        return createResponse(simplified);
      } catch (error) {
        return handleError(error);
      }
    },
  },

  {
    name: 'criar_aluno',
    description: 'Cria um novo aluno no sistema com upload de documentos',
    inputSchema: {
      type: 'object',
      properties: {
        nome: {
          type: 'string',
          description: 'Nome completo do aluno'
        },
        email: {
          type: 'string',
          description: 'Email válido do aluno'
        },
        telefone: {
          type: 'string',
          description: 'Número de telefone'
        },
        turmaId: {
          type: 'string',
          description: 'ID da turma existente'
        },
        biUrl: {
          type: 'string',
          description: 'Arquivo do BI em base64 (opcional)'
        },
        comprovativoUrl: {
          type: 'string',
          description: 'Comprovativo de pagamento em base64 (opcional)'
        },
        status: {
          type: 'string',
          enum: ['ativo', 'inativo', 'pendente'],
          description: 'Status do aluno'
        },
      },
      required: ['nome', 'email', 'telefone', 'turmaId'],
    },
    handler: async (input: any) => {
      try {

        if (!input.nome?.trim()) {
          return createResponse('Nome é obrigatório', true);
        }
        if (!input.email?.trim()) {
          return createResponse('Email é obrigatório', true);
        }
        if (!input.telefone?.trim()) {
          return createResponse('Telefone é obrigatório', true);
        }
        if (!input.turmaId?.trim()) {
          return createResponse('ID da turma é obrigatório', true);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
          return createResponse('Email inválido', true);
        }

        const data: any = {
          nome: input.nome.trim(),
          email: input.email.trim().toLowerCase(),
          telefone: input.telefone.trim(),
          turmaId: input.turmaId.trim(),
          status: input.status || 'ativo',
        };

        const files: any = {};

        if (input.biUrl && input.biUrl.trim() !== '') {
          try {
            files.biUrl = [{
              buffer: Buffer.from(input.biUrl, 'base64'),
              originalname: 'bi.pdf',
              mimetype: 'application/pdf'
            }];
          } catch (e) {
            return createResponse('Arquivo BI inválido (deve ser base64)', true);
          }
        }

        if (input.comprovativoUrl && input.comprovativoUrl.trim() !== '') {
          try {
            files.comprovativoUrl = [{
              buffer: Buffer.from(input.comprovativoUrl, 'base64'),
              originalname: 'comprovativo.pdf',
              mimetype: 'application/pdf'
            }];
          } catch (e) {
            return createResponse('Comprovativo inválido (deve ser base64)', true);
          }
        }

        const aluno = await AlunoService.create(data, files);

        return createResponse({
          success: true,
          message: `Aluno "${aluno.nome}" criado com sucesso!`,
          aluno: {
            id: aluno.id,
            nome: aluno.nome,
            email: aluno.email,
            turma: aluno.turma?.curso?.nome,
            status: aluno.status,
          },
        });
      } catch (error) {
        return handleError(error);
      }
    },
  },

  {
    name: 'atualizar_aluno',
    description: 'Atualiza dados de um aluno existente',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID do aluno a atualizar'
        },
        nome: { type: 'string' },
        email: { type: 'string' },
        telefone: { type: 'string' },
        turmaId: { type: 'string' },
        biUrl: {
          type: 'string',
          description: 'Novo BI em base64 (opcional)'
        },
        comprovativoUrl: {
          type: 'string',
          description: 'Novo comprovativo em base64 (opcional)'
        },
        status: {
          type: 'string',
          enum: ['ativo', 'inativo', 'pendente'],
        },
      },
      required: ['id'],
    },
    handler: async (input: any) => {
      try {
        if (!input.id || input.id.trim() === '') {
          return createResponse('ID do aluno é obrigatório', true);
        }

        const updateData: any = {};

        if (input.nome?.trim()) updateData.nome = input.nome.trim();
        if (input.email?.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.email)) {
            return createResponse('Email inválido', true);
          }
          updateData.email = input.email.trim().toLowerCase();
        }
        if (input.telefone?.trim()) updateData.telefone = input.telefone.trim();
        if (input.turmaId?.trim()) updateData.turmaId = input.turmaId.trim();
        if (input.status) updateData.status = input.status;

        const files: any = {};

        if (input.biUrl && input.biUrl.trim() !== '') {
          try {
            files.biUrl = [{
              buffer: Buffer.from(input.biUrl, 'base64'),
              originalname: 'bi.pdf',
              mimetype: 'application/pdf'
            }];
          } catch (e) {
            return createResponse('Arquivo BI inválido', true);
          }
        }

        if (input.comprovativoUrl && input.comprovativoUrl.trim() !== '') {
          try {
            files.comprovativoUrl = [{
              buffer: Buffer.from(input.comprovativoUrl, 'base64'),
              originalname: 'comprovativo.pdf',
              mimetype: 'application/pdf'
            }];
          } catch (e) {
            return createResponse('Comprovativo inválido', true);
          }
        }

        if (Object.keys(updateData).length === 0 && Object.keys(files).length === 0) {
          return createResponse('Nenhum dado fornecido para atualização', true);
        }

        const aluno = await AlunoService.update(input.id, updateData, files);

        return createResponse({
          success: true,
          message: `Aluno "${aluno.nome}" atualizado com sucesso!`,
          aluno: {
            id: aluno.id,
            nome: aluno.nome,
            email: aluno.email,
            turma: aluno.turma?.curso?.nome,
            status: aluno.status,
            updatedAt: aluno.updatedAt,
          },
        });
      } catch (error) {
        return handleError(error);
      }
    },
  },

  {
    name: 'deletar_aluno',
    description: 'Remove permanentemente um aluno do sistema',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID do aluno a deletar'
        },
      },
      required: ['id'],
    },
    handler: async (input: { id: string }) => {
      try {
        if (!input.id || input.id.trim() === '') {
          return createResponse('ID do aluno é obrigatório', true);
        }

        const existing = await AlunoService.findById(input.id);
        if (!existing) {
          return createResponse(`Aluno com ID "${input.id}" não encontrado`, true);
        }

        await AlunoService.delete(input.id);

        return createResponse({
          success: true,
          message: `Aluno "${existing.nome}" (ID: ${input.id}) deletado com sucesso`,
          deletedAt: new Date().toISOString(),
        });
      } catch (error) {
        return handleError(error);
      }
    },
  },
];