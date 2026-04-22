import type { Request, Response } from "express";
interface UpdateProfileData {
    nome?: string;
    email?: string;
}
interface UpdatePasswordData {
    senhaAtual: string;
    novaSenha: string;
}
declare class AuthService {
    register(nome: string, email: string, senha: string, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            nome: string;
            createdAt: Date;
        };
    }>;
    login(email: string, senha: string, res: Response): Promise<{
        user: {
            id: string;
            nome: string;
            email: string;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, data: UpdateProfileData): Promise<{
        id: string;
        email: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePassword(userId: string, data: UpdatePasswordData): Promise<{
        message: string;
    }>;
    refresh(refreshToken: string, res: Response): Promise<{
        message: string;
    }>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map