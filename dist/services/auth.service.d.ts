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
    register(nome: string, email: string, senha: string): Promise<{
        user: {
            id: string;
            email: string;
            nome: string;
            createdAt: Date;
        };
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    login(email: string, senha: string): Promise<{
        user: {
            id: string;
            nome: string;
            email: string;
        };
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
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
    refresh(refreshToken: string): Promise<{
        newAccessToken: string;
        newRefreshToken: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map