import type { Request, Response } from "express";
declare class TurmaController {
    createTurma(req: Request, res: Response): Promise<void>;
    getAllTurmas(req: Request, res: Response): Promise<void>;
    getTurmaById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateTurma(req: Request, res: Response): Promise<void>;
    deleteTurma(req: Request, res: Response): Promise<void>;
}
declare const _default: TurmaController;
export default _default;
//# sourceMappingURL=turma.controller.d.ts.map