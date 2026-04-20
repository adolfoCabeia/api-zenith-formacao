import type { Request, Response } from "express";
declare class AuthController {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    logout(req: Request, res: Response): Promise<void>;
    profile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updatePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map