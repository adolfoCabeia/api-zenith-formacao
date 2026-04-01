import cursoService from '../../services/curso.service.js';

const createResponse = (data: any, isError = false) => ({
    content: [
        { type: 'text' as const, text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }
    ],
    isError
})

const handleError = (error: any) => {
    console.error(`[CursoTools] Erro: ${error}`)
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    return createResponse(`Erro: ${message}`, true)
}

export const cursoTools = [
    {
        name: 'listar_cursos',
        description: 'Lista todos os cursos disponíveis no sistema em formato legível',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        handler: async () => {
            try {
                const cursos = await cursoService.findAll();

                if (!cursos || cursos.length === 0) {
                    return {
                        content: [{
                            type: 'text',
                            text: 'Não existem cursos cadastrados no sistema.'
                        }]
                    };
                }

                // Formato mais legível para o Gemini
                const lista = cursos.map((c, i) =>
                    `${i + 1}. ${c.nome} - ${c.preco} KZ (ID: ${c.id})`
                ).join('\n');

                const texto = `📚 Cursos disponíveis (${cursos.length} total):\n\n${lista}`;

                return {
                    content: [{
                        type: 'text',
                        text: texto
                    }]
                };
            } catch (error) {
                return handleError(error);
            }
        }
    },

    {
        name: 'buscar_curso',
        description: 'Busca um aluno específico com o pelo ID',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID do único curso (UUID)'
                }
            },
            required: ['id']
        },
        handler: async (input: ({ id: 'string' })) => {
            if (!input.id || input.id.trim() == '') {
                return createResponse('Id do curso Obrigado', true)
            }

            const curso = await cursoService.findById(input.id)

            if (!curso) {
                return createResponse(`Curso com id: ${input.id} não encotrado`, true)
            }

            const simplified = {
                nome: curso.nome,
                preco: curso.preco,
                criadoEm: curso.criadoEm
            }

            return createResponse(simplified)
        }
    },

    {
        name: 'criar_curso',
        description: 'cria um novo aluno no sistema',
        inputSchema: {
            type: 'object',
            properties: {
                nome: {
                    type: 'string',
                    description: 'nome do curso'
                },
                preco: {
                    type: 'number',
                    description: 'Preço do curso em KZ',
                    minimum: 0,
                }
            },
            required: ['nome', 'preco']
        },

        handler: async (input: ({ nome: string; preco: number })) => {
            try {
                if (!input.nome?.trim()) {
                    return createResponse("Nome Obrigatório", true)
                }
                if (input.preco === undefined || input.preco === null) {
                    return createResponse('Preço do curso é obrigatório', true);
                }

                if (typeof input.preco !== 'number' || input.preco < 0) {
                    return createResponse('Preço deve ser um número positivo', true);
                }

                const curso = await cursoService.create({
                    nome: input.nome.trim(),
                    preco: input.preco
                })

                return createResponse({
                    success: true,
                    message: `Curso ${curso.nome} criado com sucesso`,
                    curso: {
                        id: curso.id,
                        nome: curso.nome,
                        preco: curso.preco
                    }
                })
            } catch (error) {
                return handleError(error)
            }
        }
    },

    {
        name: 'atualizar_curso',
        description: 'Atualiza os dados de um curso existente',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'id do curso a ser atualizado'
                },
                nome: {
                    type: 'string',
                    description: 'nova descrição do curso'
                },
                preco: {
                    type: 'number',
                    description: 'novo preco do curso'
                }
            },
            required: ['id']
        },

        handler: async (input: ({ id: string, nome?: string, preco?: number })) => {
            try {
                if (!input.id || input.id.trim() === '') {
                    return createResponse('ID do curso é obrigatório', true);
                }

                const updateData: any = {};

                if (input.nome?.trim()) {
                    updateData.nome = input.nome.trim();
                }

                if (input.preco !== undefined && input.preco !== null) {
                    if (typeof input.preco !== 'number' || input.preco < 0) {
                        return createResponse('Preço deve ser um número positivo', true);
                    }
                    updateData.preco = input.preco;
                }

                if (Object.keys(updateData).length === 0) {
                    return createResponse('Nenhum dado fornecido para atualização', true);
                }

                const curso = await cursoService.update(input.id, updateData)

                return createResponse({
                    success: true,
                    message: `Aluno ${curso.nome} atualizado com sucesso`,
                    curso: {
                        nome: curso.nome,
                        preco: curso.preco
                    }
                })
            } catch (error) {
                return handleError(error)
            }
        }
    },

    {
        name: "deletar_curso",
        description: "Remove permanentemente um curso do sistema",
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Id do curso'
                }
            }
        },
        required: ['id'],

        handler: async (input: { id: string }) => {
            try {
                if (!input.id || input.id.trim() == '') {
                    return createResponse("ID do curso obrigatorio", true)
                }

                const existing = await cursoService.findById(input.id)
                if (!existing) {
                    return createResponse(`curso com o id: ${input.id} não existente`, true)
                }

                await cursoService.delete(input.id)

                return createResponse({
                    success: true,
                    message: `curso com id: ${input.id} eliminado permanentemente`,
                    deletedAt: new Date().toISOString(),
                })
            } catch (error) {
                return handleError(error)
            }
        }
    }
]