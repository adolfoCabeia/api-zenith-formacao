interface CreateAlunoDTO {
    nome: string;
    email: string;
    telefone: string;
    curso: string;
    biUrl: string;
    comprovativoUrl: string;
}
export declare class AlunoService {
    create(data: CreateAlunoDTO): Promise<{
        id: string;
        email: string;
        nome: string;
        telefone: string;
        curso: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        nome: string;
        telefone: string;
        curso: string;
        createdAt: Date;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        nome: string;
        telefone: string;
        curso: string;
        createdAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        email: string;
        nome: string;
        telefone: string;
        curso: string;
        createdAt: Date;
    }>;
}
export {};
//# sourceMappingURL=aluno.service.d.ts.map