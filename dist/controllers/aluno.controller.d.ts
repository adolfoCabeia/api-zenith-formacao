import type { Request, Response } from 'express';
interface MulterRequest extends Request {
    files?: {
        biUrl?: Express.Multer.File[];
        comprovativoUrl?: Express.Multer.File[];
    };
}
declare class AlunoController {
    createAluno(req: MulterRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllAlunos(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAlunoById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteAluno(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateAluno(req: MulterRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: AlunoController;
export default _default;
//# sourceMappingURL=aluno.controller.d.ts.map