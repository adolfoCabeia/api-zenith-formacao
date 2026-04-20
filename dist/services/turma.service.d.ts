interface TurmaData {
    cursoId: string;
    diaSemana?: string[];
    horario?: string;
    dataInicio?: Date | string;
    dataFim?: Date | string;
    capacidade?: number;
}
declare class TurmaService {
    create(data: TurmaData): Promise<{
        curso: {
            id: string;
            nome: string;
            preco: number;
            criadoEm: Date;
            atualizadoEm: Date;
        };
        alunos: {
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
        }[];
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
    }>;
    findAll(): Promise<({
        curso: {
            id: string;
            nome: string;
            preco: number;
            criadoEm: Date;
            atualizadoEm: Date;
        };
        alunos: {
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
        }[];
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
    })[]>;
    findById(id: string): Promise<({
        curso: {
            id: string;
            nome: string;
            preco: number;
            criadoEm: Date;
            atualizadoEm: Date;
        };
        alunos: {
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
        }[];
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
    }) | null>;
    update(id: string, data: TurmaData): Promise<{
        curso: {
            id: string;
            nome: string;
            preco: number;
            criadoEm: Date;
            atualizadoEm: Date;
        };
        alunos: {
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
        }[];
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
    }>;
    delete(id: string): Promise<{
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
    }>;
}
declare const _default: TurmaService;
export default _default;
//# sourceMappingURL=turma.service.d.ts.map