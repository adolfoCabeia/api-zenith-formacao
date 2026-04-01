import { prisma } from "../config/prismaConfig.js";

interface CursoData {
    nome?: string;
    preco?: number;
}

class CursoService {

    async create(data: CursoData) {
        if (!data.nome || data.preco === undefined) {
            throw new Error("Nome e preço do curso são obrigatórios");
        }

        const cursoExistente = await prisma.curso.findFirst({
            where: { nome: data.nome }
        });

        if (cursoExistente) {
            throw new Error("Curso já existe");
        }

        const curso = await prisma.curso.create({
            data: {
                nome: data.nome,
                preco: data.preco
            }
        });

        return curso;
    }

    async findAll() {
        const cursos = await prisma.curso.findMany({
            orderBy: { criadoEm: 'desc' }
        });
        return cursos || [];
    }

    async findById(id: string) {
        if (!id) throw new Error("ID não fornecido");

        return await prisma.curso.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: CursoData) {
        const cursoExistente = await prisma.curso.findUnique({ where: { id } });
        if (!cursoExistente) {
            throw new Error("Curso não encontrado");
        }

        if (data.nome && data.nome !== cursoExistente.nome) {
            const nomeExistente = await prisma.curso.findFirst({
                where: { nome: data.nome }
            });

            if (nomeExistente) {
                throw new Error("Já existe um curso com este nome");
            }
        }

        return await prisma.curso.update({
            where: { id },
            data: {
                nome: data.nome ?? cursoExistente.nome,
                preco: data.preco ?? cursoExistente.preco
            }
        });
    }

    async delete(id: string) {
        const cursoExistente = await prisma.curso.findUnique({ where: { id } });
        if (!cursoExistente) {
            throw new Error("Curso não encontrado");
        }
        return await prisma.curso.delete({ where: { id } });
    }
}

export default new CursoService();