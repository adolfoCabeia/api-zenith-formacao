import pagamentoService from '../../services/pagamento.service.js';
const createResponse = (data, isError = false) => ({
    content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }],
    isError
});
const handleError = (error) => {
    console.error(`[HANDLEERROR] ERRO:`, error);
    const message = error instanceof Error ? error.message : 'Erro Desconhecido';
    return createResponse(`Erro: ${message}`, true);
};
export const pagamentoTools = [
    {
        name: 'listar_pagamentos',
        description: 'Lista todos os pagamentos cadastrados no sistema',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        handler: async (args, extra) => {
            try {
                console.log(`[listar_pagamentos] Contexto:`, extra?.context?.email || 'sem contexto');
                const pagamentos = await pagamentoService.findAll();
                if (!pagamentos || pagamentos.length === 0) {
                    return createResponse('Nenhum pagamento encontrado no sistema.');
                }
                const simplified = pagamentos.map(p => ({
                    id: p.id,
                    aluno: p.aluno?.nome || 'N/A',
                    valor: p.valor,
                    status: p.status,
                    data: p.data,
                    criadoEm: p.createdAt
                }));
                return createResponse({
                    total: pagamentos.length,
                    pagamentos: simplified
                });
            }
            catch (error) {
                return handleError(error);
            }
        }
    },
    {
        name: 'buscar_pagamento',
        description: 'Busca um pagamento específico pelo ID',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID único do pagamento (UUID)'
                }
            },
            required: ['id']
        },
        handler: async (input) => {
            try {
                if (!input.id || input.id.trim() === '') {
                    return createResponse('ID do pagamento é obrigatório', true);
                }
                const pagamento = await pagamentoService.findById(input.id);
                if (!pagamento) {
                    return createResponse(`Pagamento com ID "${input.id}" não encontrado`, true);
                }
                const simplified = {
                    id: pagamento.id,
                    aluno: pagamento.aluno?.nome || 'N/A',
                    alunoId: pagamento.alunoId,
                    valor: pagamento.valor,
                    status: pagamento.status,
                    data: pagamento.data,
                    criadoEm: pagamento.createdAt
                };
                return createResponse(simplified);
            }
            catch (error) {
                return handleError(error);
            }
        }
    },
    {
        name: 'criar_pagamento',
        description: 'Cria um novo pagamento para um aluno',
        inputSchema: {
            type: 'object',
            properties: {
                alunoId: {
                    type: 'string',
                    description: 'ID do aluno'
                },
                valor: {
                    type: 'number',
                    description: 'Valor do pagamento em KZ',
                    minimum: 0
                },
                status: {
                    type: 'string',
                    description: 'Status do pagamento',
                    enum: ['pendente', 'pago', 'atrasado', 'cancelado']
                },
                data: {
                    type: 'string',
                    description: 'Data do pagamento (ISO 8601)',
                    format: 'date-time'
                }
            },
            required: ['alunoId', 'valor', 'status']
        },
        handler: async (input) => {
            try {
                if (!input.alunoId?.trim()) {
                    return createResponse('ID do aluno é obrigatório', true);
                }
                if (input.valor === undefined || input.valor === null) {
                    return createResponse('Valor do pagamento é obrigatório', true);
                }
                if (typeof input.valor !== 'number' || input.valor <= 0) {
                    return createResponse('Valor deve ser um número positivo', true);
                }
                if (!input.status?.trim()) {
                    return createResponse('Status do pagamento é obrigatório', true);
                }
                const pagamento = await pagamentoService.create({
                    alunoId: input.alunoId.trim(),
                    valor: input.valor,
                    status: input.status.trim(),
                    data: input.data ? new Date(input.data) : new Date()
                });
                return createResponse({
                    success: true,
                    message: `Pagamento de ${pagamento.valor} KZ criado com sucesso!`,
                    pagamento: {
                        id: pagamento.id,
                        alunoId: pagamento.alunoId,
                        valor: pagamento.valor,
                        status: pagamento.status,
                        data: pagamento.data,
                        criadoEm: pagamento.createdAt
                    }
                });
            }
            catch (error) {
                return handleError(error);
            }
        }
    },
    {
        name: 'atualizar_pagamento',
        description: 'Atualiza dados de um pagamento existente',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID do pagamento a atualizar'
                },
                valor: {
                    type: 'number',
                    description: 'Novo valor do pagamento',
                    minimum: 0
                },
                status: {
                    type: 'string',
                    description: 'Novo status do pagamento',
                    enum: ['pendente', 'pago', 'atrasado', 'cancelado']
                },
                data: {
                    type: 'string',
                    description: 'Nova data do pagamento (ISO 8601)',
                    format: 'date-time'
                }
            },
            required: ['id']
        },
        handler: async (input) => {
            try {
                if (!input.id || input.id.trim() === '') {
                    return createResponse('ID do pagamento é obrigatório', true);
                }
                const updateData = {};
                if (input.valor !== undefined && input.valor !== null) {
                    if (typeof input.valor !== 'number' || input.valor <= 0) {
                        return createResponse('Valor deve ser um número positivo', true);
                    }
                    updateData.valor = input.valor;
                }
                if (input.status?.trim()) {
                    updateData.status = input.status.trim();
                }
                if (input.data) {
                    updateData.data = new Date(input.data);
                }
                if (Object.keys(updateData).length === 0) {
                    return createResponse('Nenhum dado fornecido para atualização', true);
                }
                const pagamento = await pagamentoService.update(input.id, updateData);
                return createResponse({
                    success: true,
                    message: `Pagamento atualizado com sucesso!`,
                    pagamento: {
                        id: pagamento.id,
                        alunoId: pagamento.alunoId,
                        valor: pagamento.valor,
                        status: pagamento.status,
                        data: pagamento.data,
                        atualizadoEm: pagamento.updatedAt
                    }
                });
            }
            catch (error) {
                return handleError(error);
            }
        }
    },
    {
        name: 'deletar_pagamento',
        description: 'Remove permanentemente um pagamento do sistema',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID do pagamento a deletar'
                }
            },
            required: ['id']
        },
        handler: async (input) => {
            try {
                if (!input.id || input.id.trim() === '') {
                    return createResponse('ID do pagamento é obrigatório', true);
                }
                const existing = await pagamentoService.findById(input.id);
                if (!existing) {
                    return createResponse(`Pagamento com ID "${input.id}" não encontrado`, true);
                }
                await pagamentoService.delete(input.id);
                return createResponse({
                    success: true,
                    message: `Pagamento de ${existing.valor} KZ (ID: ${input.id}) deletado com sucesso`,
                    deletedAt: new Date().toISOString()
                });
            }
            catch (error) {
                return handleError(error);
            }
        }
    }
];
//# sourceMappingURL=pagamentoTools.js.map