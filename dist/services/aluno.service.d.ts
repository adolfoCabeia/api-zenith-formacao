import { StatusAluno } from '../generated/prisma/enums.js';
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
type AlunoWithRelations = {
    id: string;
    email: string;
    nome: string;
    telefone: string;
    biUrl: string;
    comprovativoUrl: string;
    turmaId: string;
    status: StatusAluno;
    createdAt: Date;
    updatedAt: Date;
    turma: {
        id: string;
        diaSemana: string[];
        horario: string;
        dataInicio: Date;
        dataFim: Date;
        capacidade: number;
        cursoId: string;
        createdAt: Date;
        updatedAt: Date;
        curso: {
            id: string;
            nome: string;
            preco: number;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
    } | null;
    pagamentos: Array<{
        id: string;
        alunoId: string;
        valor: number;
        status: string;
        data: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
declare class AlunoService {
    create(data: AlunoData, files: AlunoFiles): Promise<AlunoWithRelations>;
    findAll(): Promise<AlunoWithRelations[]>;
    findById(id: string): Promise<AlunoWithRelations | null>;
    update(id: string, data: Partial<AlunoData>, files?: AlunoFiles): Promise<AlunoWithRelations>;
    delete(id: string): Promise<AlunoWithRelations>;
}
declare const _default: AlunoService;
export default _default;
export { StatusAluno };
//# sourceMappingURL=aluno.service.d.ts.map