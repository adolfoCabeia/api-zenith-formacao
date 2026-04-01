import { prisma } from "../config/prismaConfig.js";

export const dashboardService = {
  count: async () => {
    const [usuarios, aluno, turma, curso] = await Promise.all([
      prisma.usuario.count(),
      prisma.aluno.count(),
      prisma.turma.count(),
      prisma.curso.count(),
    ]);

    return {
      usuarios,
      aluno,
      turma,
      curso,
    };
  },

  calc: async () => {
    const now = new Date();
    const mesAtual = now.getMonth();
    const anoAtual = now.getFullYear();

    const [pagamentos, alunos, turmas] = await Promise.all([
      prisma.pagamento.findMany(),
      prisma.aluno.findMany(),
      prisma.turma.findMany({
        include: {
          curso: true,
          alunos: true,
        },
      }),
    ]);

    const receitaTotal = pagamentos.reduce(
      (acc, p) => acc + p.valor,
      0
    );

    const receitaMensal = pagamentos
      .filter((p) => {
        const d = new Date(p.data);
        return (
          d.getMonth() === mesAtual &&
          d.getFullYear() === anoAtual
        );
      })
      .reduce((acc, p) => acc + p.valor, 0);

    const receitaPrevista = turmas.reduce((acc, turma) => {
      const alunosAtivos = turma.alunos.length;
      const preco = turma.curso.preco;

      return acc + alunosAtivos * preco * 3;
    }, 0);

    const totalAlunos = alunos.length;

    const alunosAprovados = alunos.filter(
      (a) => a.status === "APROVADO"
    ).length;

    const taxaAprovacao =
      totalAlunos > 0
        ? (alunosAprovados / totalAlunos) * 100
        : 0;

    const taxaOcupacao = turmas.map((turma) => {
      const ocupacao =
        (turma.alunos.length / turma.capacidade) * 100;

      return {
        turmaId: turma.id,
        ocupacao: Math.round(ocupacao),
      };
    });

    const mediaAlunosPorTurma =
      turmas.length > 0
        ? alunos.length / turmas.length
        : 0;

    const alunosInadimplentes = await prisma.aluno.findMany({
      where: {
        status: "APROVADO",
        pagamentos: {
          none: {
            data: {
              gte: new Date(anoAtual, mesAtual, 1),
              lt: new Date(anoAtual, mesAtual + 1, 1),
            },
          },
        },
      },
      include: {
        turma: {
          include: { curso: true },
        },
      },
    });

    const totalInadimplentes = alunosInadimplentes.length;

    const meses = [];

    for (let i = 5; i >= 0; i--) {
      const data = new Date();
      data.setMonth(data.getMonth() - i);

      const inicio = new Date(
        data.getFullYear(),
        data.getMonth(),
        1
      );

      const fim = new Date(
        data.getFullYear(),
        data.getMonth() + 1,
        1
      );

      const pagamentosMes = await prisma.pagamento.aggregate({
        _sum: { valor: true },
        where: {
          data: {
            gte: inicio,
            lt: fim,
          },
        },
      });

      meses.push({
        mes: `${data.getMonth() + 1}/${data.getFullYear()}`,
        total: pagamentosMes._sum.valor || 0,
      });
    }
    const cursos = await prisma.curso.findMany({
      include: {
        turmas: {
          include: {
            alunos: true,
          },
        },
      },
    });

    const cursosRanking = cursos.map((curso) => {
      const totalAlunos = curso.turmas.reduce(
        (acc, turma) => acc + turma.alunos.length,
        0
      );

      return {
        curso: curso.nome,
        totalAlunos,
        receita: totalAlunos * curso.preco,
      };
    });

    cursosRanking.sort(
      (a, b) => b.totalAlunos - a.totalAlunos
    );

    const topCursos = cursosRanking.slice(0, 5);

    return {
      receitaTotal,
      receitaMensal,
      receitaPrevista,

      totalAlunos,
      alunosAprovados,
      taxaAprovacao: Math.round(taxaAprovacao),

      mediaAlunosPorTurma: Math.round(mediaAlunosPorTurma),
      taxaOcupacao,

      totalInadimplentes,
      inadimplentes: alunosInadimplentes,

      receitaMensalGrafico: meses,

      topCursos,
    };
  },
};