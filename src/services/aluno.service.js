import { prisma } from "../config/prismaConfig.js";
export class AlunoService {
    async create(data) {
        const alunoExistente = await prisma.aluno.findUnique({
            where: { email: data.email }
        });
        if (alunoExistente) {
            throw new Error('Aluno já cadastrado com este email');
        }
        const aluno = await prisma.aluno.create({
            data
        });
        return aluno;
    }
    async findAll() {
        return prisma.aluno.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    async findById(id) {
        const aluno = await prisma.aluno.findUnique({
            where: { id }
        });
        if (!aluno) {
            throw new Error('Aluno não encontrado');
        }
        return aluno;
    }
    async delete(id) {
        await this.findById(id);
        return prisma.aluno.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=aluno.service.js.map