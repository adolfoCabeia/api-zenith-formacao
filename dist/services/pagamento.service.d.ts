interface PagamentoData {
    alunoId: string;
    valor: number;
    status?: string;
    data?: Date | string;
}
declare class PagamentoService {
    create(data: PagamentoData): Promise<{
        aluno: {
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
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        alunoId: string;
        valor: number;
    }>;
    findAll(): Promise<({
        aluno: {
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
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        alunoId: string;
        valor: number;
    })[]>;
    findById(id: string): Promise<({
        aluno: {
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
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        alunoId: string;
        valor: number;
    }) | null>;
    update(id: string, data: Partial<PagamentoData>): Promise<{
        aluno: {
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
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        alunoId: string;
        valor: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        data: Date;
        alunoId: string;
        valor: number;
    }>;
}
declare const _default: PagamentoService;
export default _default;
//# sourceMappingURL=pagamento.service.d.ts.map