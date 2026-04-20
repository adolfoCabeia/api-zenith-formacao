import type { Request, Response } from 'express';
declare class CursoController {
    createCurso(req: Request, resp: Response): Promise<void>;
    getAllCursos(req: Request, resp: Response): Promise<void>;
    getCursoById(req: Request, resp: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateCurso(req: Request, resp: Response): Promise<void>;
    deleteCurso(req: Request, resp: Response): Promise<void>;
}
declare const _default: CursoController;
export default _default;
//# sourceMappingURL=curso.controller.d.ts.map