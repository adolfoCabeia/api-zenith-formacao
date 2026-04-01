import { prisma } from "../config/prismaConfig.js";

interface PagamentoData {
  alunoId: string;
  valor: number;
  status?: string;
  data?: Date | string;
}

class PagamentoService {
  async create(data: PagamentoData) {
    if (!data.alunoId || data.valor === undefined) {
      throw new Error("Aluno e valor são obrigatórios");
    }

    const aluno = await prisma.aluno.findUnique({ where: { id: data.alunoId } });
    if (!aluno) throw new Error("Aluno não encontrado");

    const pagamento = await prisma.pagamento.create({
      data: {
        alunoId: data.alunoId,
        valor: data.valor,
        status: data.status || "pendente",
        data: data.data ? new Date(data.data) : undefined,
      },
      include: { aluno: true },
    });

    return pagamento;
  }

  async findAll() {
    return await prisma.pagamento.findMany({
      orderBy: { data: "desc" },
      include: { aluno: true },
    });
  }

  async findById(id: string) {
    return await prisma.pagamento.findUnique({
      where: { id },
      include: { aluno: true },
    });
  }

  async update(id: string, data: Partial<PagamentoData>) {
    const pagamentoExistente = await prisma.pagamento.findUnique({ where: { id } });
    if (!pagamentoExistente) throw new Error("Pagamento não encontrado");

    if (data.alunoId) {
      const aluno = await prisma.aluno.findUnique({ where: { id: data.alunoId } });
      if (!aluno) throw new Error("Aluno não encontrado");
    }

    return await prisma.pagamento.update({
      where: { id },
      data: {
        ...data,
        data: data.data ? new Date(data.data) : undefined,
      },
      include: { aluno: true },
    });
  }

  async delete(id: string) {
    return await prisma.pagamento.delete({ where: { id } });
  }
}

export default new PagamentoService();