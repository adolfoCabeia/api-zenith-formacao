import { z } from 'zod';
import { prisma } from '../../config/prismaConfig.js';

export const alunoTools = [
    {
        name: 'criar_aluno',
        description: 'Cria um novo aluno',
        inputSchema: {
            type: 'object',
            properties: {
                nome: { type: 'string' },
                email: { type: 'string' },
                telefone: { type: 'string' },
                curso: { type: 'string' },
                biUrl: { type: 'string' },
                comprovativoUrl: { type: 'string' },
            },
            required: ['nome', 'email', 'telefone', 'curso', 'biUrl', 'comprovativoUrl'],
        },
        handler: async (input) => {
            const aluno = await prisma.aluno.create({
                data: input,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(aluno),
                    },
                ],
            };
        },
    },
    {
        name: 'listar_alunos',
        description: 'Lista todos os alunos',
        inputSchema: {
            type: 'object',
            properties: {},
        },
        handler: async () => {
            const alunos = await prisma.aluno.findMany();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(alunos),
                    },
                ],
            };
        },
    },
];
//# sourceMappingURL=alunoTools.js.map