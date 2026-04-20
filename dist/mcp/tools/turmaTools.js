import TurmaService from '../../services/turma.service.js';
const createResponse = (data, isError = false) => ({
    content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }],
    isError
});
const handleError = (error) => {
    console.error('[TurmaTools] Erro:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return createResponse(`Erro: ${message}`, true);
};
export const turmaTools = [
    {
        name: 'listar_turmas',
        description: 'Lista todas as turmas cadastradas no sistema em formato legível',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        handler: async (args, extra) => {
            try {
                console.log('[listar_turmas] Contexto:', extra?.context?.email || 'sem contexto');
                const turmas = await TurmaService.findAll();
                if (!turmas || turmas.length === 0) {
                    return {
                        content: [{
                                type: 'text',
                                text: 'Não existem turmas cadastradas no sistema.'
                            }]
                    };
                }
                const lista = turmas.map((t, i) => {
                    const cursoNome = t.curso?.nome || 'Curso não definido';
                    return `${i + 1}. ${cursoNome} | ${t.diaSemana.join(', ')} às ${t.horario} | ` +
                        `Início: ${new Date(t.dataInicio).toLocaleDateString('pt-PT')} | ` +
                        `Capacidade: ${t.capacidade} alunos (ID: ${t.id})`;
                }).join('\n');
                const texto = `Turmas disponíveis (${turmas.length} total):\n\n${lista}`;
                return {
                    content: [{
                            type: 'text',
                            text: texto
                        }]
                };
            }
            catch (error) {
                return handleError(error);
            }
        }
    },
    {
        name: 'buscar_turma',
        description: 'Busca uma turma específica pelo ID',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID único da turma (UUID)'
                }
            },
            required: ['id']
        },
        handler: async (input) => {
            try {
                if (!input.id || input.id.trim() === '') {
                    return createResponse('ID da turma é obrigatório', true);
                }
                const turma = await TurmaService.findById(input.id);
                if (!turma) {
                    return createResponse(`Turma com ID "${input.id}" não encontrada`, true);
                }
                const cursoNome = turma.curso?.nome || 'N/A';
                const alunosCount = turma.alunos?.length || 0;
                const texto = `Detalhes da turma:\n\n` +
                    `Curso: ${cursoNome}\n` +
                    `Dia: ${turma.diaSemana.join(', ')}\n` +
                    `Horário: ${turma.horario}\n` +
                    `Início: ${new Date(turma.dataInicio).toLocaleDateString('pt-PT')}\n` +
                    `Fim: ${new Date(turma.dataFim).toLocaleDateString('pt-PT')}\n` +
                    `Capacidade: ${turma.capacidade} alunos\n` +
                    `Alunos matriculados: ${alunosCount}\n` +
                    `ID: ${turma.id}`;
                return {
                    content: [{
                            type: 'text',
                            text: texto
                        }]
                };
            }
            catch (error) {
                return handleError(error);
            }
        }
    },
    {
        name: 'criar_turma',
        description: 'Cria uma nova turma no sistema',
        inputSchema: {
            type: 'object',
            properties: {
                cursoId: {
                    type: 'string',
                    description: 'ID do curso existente'
                },
                diaSemana: {
                    type: 'array',
                    description: 'Dias da semana da turma',
                    items: {
                        type: 'string',
                        enum: [
                            'segunda',
                            'terca',
                            'quarta',
                            'quinta',
                            'sexta',
                            'sabado',
                            'domingo'
                        ]
                    },
                    example: ['segunda', 'quarta', 'sexta']
                },
                horario: {
                    type: 'string',
                    description: 'Horário (ex: 19:00-21:00)'
                },
                dataInicio: {
                    type: 'string',
                    description: 'Data de início (ISO 8601)',
                    format: 'date-time'
                },
                dataFim: {
                    type: 'string',
                    description: 'Data de fim (ISO 8601)',
                    format: 'date-time'
                },
                capacidade: {
                    type: 'number',
                    description: 'Número máximo de alunos',
                    minimum: 1
                }
            },
            required: ['cursoId', 'diaSemana', 'horario', 'dataInicio', 'dataFim', 'capacidade']
        },
        handler: async (input) => {
            try {
                if (!input.cursoId?.trim()) {
                    return createResponse('ID do curso é obrigatório', true);
                }
                if (!input.diaSemana || !Array.isArray(input.diaSemana) || input.diaSemana.length === 0) {
                    return createResponse('Dia da semana é obrigatório (array)', true);
                }
                if (!input.horario?.trim()) {
                    return createResponse('Horário é obrigatório', true);
                }
                if (!input.dataInicio) {
                    return createResponse('Data de início é obrigatória', true);
                }
                if (!input.dataFim) {
                    return createResponse('Data de fim é obrigatória', true);
                }
                if (input.capacidade === undefined || input.capacidade < 1) {
                    return createResponse('Capacidade deve ser pelo menos 1 aluno', true);
                }
                const turma = await TurmaService.create({
                    cursoId: input.cursoId.trim(),
                    diaSemana: input.diaSemana,
                    horario: input.horario.trim(),
                    dataInicio: new Date(input.dataInicio),
                    dataFim: new Date(input.dataFim),
                    capacidade: input.capacidade
                });
                const cursoNome = turma.curso?.nome || 'N/A';
                const texto = `✅ Turma criada com sucesso!\n\n` +
                    `Curso: ${cursoNome}\n` +
                    `Dia: ${turma.diaSemana.join(', ')} às ${turma.horario}\n` +
                    `Período: ${new Date(turma.dataInicio).toLocaleDateString('pt-PT')} a ${new Date(turma.dataFim).toLocaleDateString('pt-PT')}\n` +
                    `Capacidade: ${turma.capacidade} alunos\n` +
                    `ID: ${turma.id}`;
                return {
                    content: [{
                            type: 'text',
                            text: texto
                        }]
                };
            }
            catch (error) {
                return handleError(error);
            }
        }
    },
    {
        name: 'atualizar_turma',
        description: 'Atualiza dados de uma turma existente',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID da turma a atualizar'
                },
                cursoId: {
                    type: 'string',
                    description: 'Novo ID do curso'
                },
                diaSemana: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Novos dias da semana'
                },
                horario: {
                    type: 'string',
                    description: 'Novo horário'
                },
                dataInicio: {
                    type: 'string',
                    description: 'Nova data de início (ISO 8601)',
                    format: 'date-time'
                },
                dataFim: {
                    type: 'string',
                    description: 'Nova data de fim (ISO 8601)',
                    format: 'date-time'
                },
                capacidade: {
                    type: 'number',
                    description: 'Nova capacidade',
                    minimum: 1
                }
            },
            required: ['id']
        },
        handler: async (input) => {
            try {
                if (!input.id || input.id.trim() === '') {
                    return createResponse('ID da turma é obrigatório', true);
                }
                const updateData = {};
                if (input.cursoId?.trim())
                    updateData.cursoId = input.cursoId.trim();
                if (input.diaSemana?.length)
                    updateData.diaSemana = input.diaSemana;
                if (input.horario?.trim())
                    updateData.horario = input.horario.trim();
                if (input.dataInicio)
                    updateData.dataInicio = new Date(input.dataInicio);
                if (input.dataFim)
                    updateData.dataFim = new Date(input.dataFim);
                if (input.capacidade !== undefined) {
                    if (input.capacidade < 1) {
                        return createResponse('Capacidade deve ser pelo menos 1', true);
                    }
                    updateData.capacidade = input.capacidade;
                }
                if (Object.keys(updateData).length === 0) {
                    return createResponse('Nenhum dado fornecido para atualização', true);
                }
                const turma = await TurmaService.update(input.id, updateData);
                const cursoNome = turma.curso?.nome || 'N/A';
                const texto = `Turma atualizada com sucesso!\n\n` +
                    `Curso: ${cursoNome}\n` +
                    `Dia: ${turma.diaSemana.join(', ')} às ${turma.horario}\n` +
                    `Período: ${new Date(turma.dataInicio).toLocaleDateString('pt-PT')} a ${new Date(turma.dataFim).toLocaleDateString('pt-PT')}\n` +
                    `Capacidade: ${turma.capacidade} alunos\n` +
                    `ID: ${turma.id}`;
                return {
                    content: [{
                            type: 'text',
                            text: texto
                        }]
                };
            }
            catch (error) {
                return handleError(error);
            }
        }
    },
    {
        name: 'deletar_turma',
        description: 'Remove permanentemente uma turma do sistema',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID da turma a deletar'
                }
            },
            required: ['id']
        },
        handler: async (input) => {
            try {
                if (!input.id || input.id.trim() === '') {
                    return createResponse('ID da turma é obrigatório', true);
                }
                const existing = await TurmaService.findById(input.id);
                if (!existing) {
                    return createResponse(`Turma com ID "${input.id}" não encontrada`, true);
                }
                const cursoNome = existing.curso?.nome || 'N/A';
                await TurmaService.delete(input.id);
                return {
                    content: [{
                            type: 'text',
                            text: `Turma de ${cursoNome} (${existing.diaSemana.join(', ')} às ${existing.horario}) deletada com sucesso.`
                        }]
                };
            }
            catch (error) {
                return handleError(error);
            }
        }
    }
];
//# sourceMappingURL=turmaTools.js.map