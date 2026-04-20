import { prisma } from '../config/prismaConfig.js';
import { UploadService } from './upload.service.js';
import { StatusAluno } from '../generated/prisma/enums.js';
class AlunoService {
    async create(data, files) {
        if (!data.nome || !data.email || !data.telefone || !data.turmaId) {
            throw new Error('Todos os campos obrigatórios devem ser preenchidos');
        }
        const alunoExistente = await prisma.aluno.findUnique({
            where: { email: data.email },
        });
        if (alunoExistente) {
            throw new Error('Aluno com este email já existe');
        }
        const turma = await prisma.turma.findUnique({
            where: { id: data.turmaId },
        });
        if (!turma) {
            throw new Error('Turma não encontrada');
        }
        let biUrl = '';
        let comprovativoUrl = '';
        if (files.biUrl?.[0]) {
            biUrl = await UploadService.uploadFile(files.biUrl[0], 'alunos/bi');
        }
        else {
            throw new Error('Bilhete de Identidade (BI) é obrigatório');
        }
        if (files.comprovativoUrl?.[0]) {
            comprovativoUrl = await UploadService.uploadFile(files.comprovativoUrl[0], 'alunos/comprovativos');
        }
        else {
            throw new Error('Comprovativo de pagamento é obrigatório');
        }
        // CORREÇÃO: Usar o enum do Prisma diretamente
        const statusValue = data.status ?? StatusAluno.PENDENTE;
        const aluno = await prisma.aluno.create({
            data: {
                nome: data.nome,
                email: data.email,
                telefone: data.telefone,
                turmaId: data.turmaId,
                biUrl,
                comprovativoUrl,
                status: statusValue,
            },
            include: {
                turma: {
                    include: { curso: true },
                },
                pagamentos: true,
            },
        });
        return aluno;
    }
    async findAll() {
        const alunos = await prisma.aluno.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                turma: {
                    include: { curso: true },
                },
                pagamentos: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        return alunos;
    }
    async findById(id) {
        if (!id)
            throw new Error('ID não fornecido');
        const aluno = await prisma.aluno.findUnique({
            where: { id },
            include: {
                turma: {
                    include: { curso: true },
                },
                pagamentos: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        return aluno;
    }
    async update(id, data, files) {
        const alunoExistente = await prisma.aluno.findUnique({ where: { id } });
        if (!alunoExistente) {
            throw new Error('Aluno não encontrado');
        }
        const updateData = { ...data };
        if (files?.biUrl?.[0]) {
            if (alunoExistente.biUrl) {
                await UploadService.deleteFile(alunoExistente.biUrl);
            }
            updateData.biUrl = await UploadService.uploadFile(files.biUrl[0], 'alunos/bi');
        }
        if (files?.comprovativoUrl?.[0]) {
            if (alunoExistente.comprovativoUrl) {
                await UploadService.deleteFile(alunoExistente.comprovativoUrl);
            }
            updateData.comprovativoUrl = await UploadService.uploadFile(files.comprovativoUrl[0], 'alunos/comprovativos');
        }
        const aluno = await prisma.aluno.update({
            where: { id },
            data: updateData,
            include: {
                turma: { include: { curso: true } },
                pagamentos: true,
            },
        });
        return aluno;
    }
    async delete(id) {
        const aluno = await prisma.aluno.findUnique({ where: { id } });
        if (!aluno) {
            throw new Error('Aluno não encontrado');
        }
        if (aluno.biUrl) {
            await UploadService.deleteFile(aluno.biUrl);
        }
        if (aluno.comprovativoUrl) {
            await UploadService.deleteFile(aluno.comprovativoUrl);
        }
        await prisma.pagamento.deleteMany({
            where: { alunoId: id },
        });
        const deleted = await prisma.aluno.delete({
            where: { id },
            include: {
                turma: {
                    include: { curso: true }
                },
                pagamentos: true
            },
        });
        return deleted;
    }
}
export default new AlunoService();
export { StatusAluno };
//# sourceMappingURL=aluno.service.js.map