interface ExtratoOptions {
    tipo: 'alunos' | 'pagamentos';
    alunoId?: string;
}
declare class ExtratoService {
    gerarPDF(options: ExtratoOptions): Promise<string>;
}
declare const _default: ExtratoService;
export default _default;
//# sourceMappingURL=extratoPdf.service.d.ts.map