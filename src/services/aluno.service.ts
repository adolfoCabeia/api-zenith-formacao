import { prisma } from '../config/prismaConfig.js';
import { UploadService } from './upload.service.js';

export enum StatusAluno {
  PENDENTE = 'PENDENTE',
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export interface AlunoData {
  nome: string;
  email: string;
  telefone: string;
  turmaId: string;
  status?: StatusAluno;
}

export interface AlunoFiles {
  biUrl?: Express.Multer.File[];
  comprovativoUrl?: Express.Multer.File[];
}

class AlunoService {
  async create(data: AlunoData, files: AlunoFiles) {
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
    } else {
      throw new Error('Bilhete de Identidade (BI) é obrigatório');
    }

    if (files.comprovativoUrl?.[0]) {
      comprovativoUrl = await UploadService.uploadFile(
        files.comprovativoUrl[0],
        'alunos/comprovativos'
      );
    } else {
      throw new Error('Comprovativo de pagamento é obrigatório');
    }
    
    // CORREÇÃO: Garantir que status nunca é undefined usando ?? (nullish coalescing)
    const statusFinal = data.status ?? StatusAluno.PENDENTE;
    
    const aluno = await prisma.aluno.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        turmaId: data.turmaId,
        biUrl,
        comprovativoUrl,
        status: statusFinal, // Agora é sempre StatusAluno, nunca undefined
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
    return await prisma.aluno.findMany({
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
  }

  async findById(id: string) {
    if (!id) throw new Error('ID não fornecido');

    return await prisma.aluno.findUnique({
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
  }

  async update(
    id: string,
    data: Partial<AlunoData>,
    files?: AlunoFiles
  ) {
    const alunoExistente = await prisma.aluno.findUnique({ where: { id } });
    if (!alunoExistente) {
      throw new Error('Aluno não encontrado');
    }

    const updateData: any = { ...data };

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
      updateData.comprovativoUrl = await UploadService.uploadFile(
        files.comprovativoUrl[0],
        'alunos/comprovativos'
      );
    }

    return await prisma.aluno.update({
      where: { id },
      data: updateData,
      include: {
        turma: { include: { curso: true } },
        pagamentos: true,
      },
    });
  }
  
  async delete(id: string) {
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

    return await prisma.aluno.delete({
      where: { id },
      include: { turma: true },
    });
  }
}

export default new AlunoService();