interface CursoData {
    nome?: string;
    preco?: number;
}
declare class CursoService {
    create(data: CursoData): Promise<{
        id: string;
        nome: string;
        preco: number;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    findAll(): Promise<{
        id: string;
        nome: string;
        preco: number;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        nome: string;
        preco: number;
        criadoEm: Date;
        atualizadoEm: Date;
    } | null>;
    update(id: string, data: CursoData): Promise<{
        id: string;
        nome: string;
        preco: number;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        nome: string;
        preco: number;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
}
declare const _default: CursoService;
export default _default;
//# sourceMappingURL=curso.service.d.ts.map