export declare const dashboardService: {
    count: () => Promise<{
        usuarios: number;
        aluno: number;
        turma: number;
        curso: number;
    }>;
    calc: () => Promise<{
        receitaTotal: number;
        receitaMensal: number;
        receitaPrevista: number;
        totalAlunos: number;
        alunosAprovados: number;
        taxaAprovacao: number;
        mediaAlunosPorTurma: number;
        taxaOcupacao: {
            turmaId: string;
            ocupacao: number;
        }[];
        totalInadimplentes: number;
        inadimplentes: ({
            turma: {
                curso: {
                    id: string;
                    nome: string;
                    preco: number;
                    criadoEm: Date;
                    atualizadoEm: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cursoId: string;
                diaSemana: string[];
                horario: string;
                dataInicio: Date;
                dataFim: Date;
                capacidade: number;
            };
        } & {
            id: string;
            email: string;
            nome: string;
            telefone: string;
            biUrl: string;
            comprovativoUrl: string;
            turmaId: string;
            status: import("./aluno.service.js").StatusAluno;
            createdAt: Date;
            updatedAt: Date;
        })[];
        receitaMensalGrafico: {
            mes: string;
            total: number;
        }[];
        topCursos: {
            curso: string;
            totalAlunos: number;
            receita: number;
        }[];
    }>;
};
//# sourceMappingURL=dashboard.service.d.ts.map