import dotenv from 'dotenv';
dotenv.config();
import { prisma } from "../config/prismaConfig.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado no .env");
}
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;
function validarForcaSenha(senha) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasLowerCase = /[a-z]/.test(senha);
    const hasNumbers = /\d/.test(senha);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    return senha.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}
function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
}
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
};
class AuthService {
    async register(nome, email, senha, res) {
        nome = sanitizeInput(nome);
        email = email.toLowerCase().trim();
        if (!nome || nome.length < 2) {
            throw new Error("Nome deve ter pelo menos 2 caracteres");
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Email inválido");
        }
        if (!validarForcaSenha(senha)) {
            throw new Error("Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial");
        }
        const userExists = await prisma.usuario.findUnique({ where: { email } });
        if (userExists) {
            throw new Error("Dados inválidos");
        }
        const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
        const user = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedPassword
            },
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
            }
        });
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
            }
        });
        res.cookie("accessToken", accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: ACCESS_TOKEN_EXPIRY
        });
        res.cookie("refreshToken", refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: REFRESH_TOKEN_EXPIRY
        });
        return { user };
    }
    async login(email, senha, res) {
        email = email.toLowerCase().trim();
        if (!email || !senha) {
            throw new Error("Credenciais inválidas");
        }
        const user = await prisma.usuario.findUnique({
            where: { email }
        });
        const dummyHash = "$2a$12$abcdefghijklmnopqrstuuuuuuuuuuuuuuuuuuuuuuuuu";
        const hashToCompare = user ? user.senha : dummyHash;
        const senhaValida = await bcrypt.compare(senha, hashToCompare);
        if (!user || !senhaValida) {
            throw new Error("Credenciais inválidas");
        }
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id }
        });
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
            }
        });
        res.cookie("accessToken", accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: ACCESS_TOKEN_EXPIRY
        });
        res.cookie("refreshToken", refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: REFRESH_TOKEN_EXPIRY
        });
        return {
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        };
    }
    async getProfile(userId) {
        if (!userId)
            throw new Error("ID do usuário inválido");
        const user = await prisma.usuario.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if (!user)
            throw new Error("Usuário não encontrado");
        return user;
    }
    async updateProfile(userId, data) {
        if (!userId)
            throw new Error("ID do usuário inválido");
        if (data.nome)
            data.nome = sanitizeInput(data.nome);
        if (data.email)
            data.email = data.email.toLowerCase().trim();
        if (data.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                throw new Error("Email inválido");
            }
            const existingUser = await prisma.usuario.findFirst({
                where: {
                    email: data.email,
                    NOT: { id: userId }
                }
            });
            if (existingUser) {
                throw new Error("Email já está em uso");
            }
        }
        const user = await prisma.usuario.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return user;
    }
    async updatePassword(userId, data) {
        if (!userId)
            throw new Error("ID do usuário inválido");
        if (!validarForcaSenha(data.novaSenha)) {
            throw new Error("Nova senha não atende aos requisitos de segurança");
        }
        const user = await prisma.usuario.findUnique({
            where: { id: userId },
            select: { senha: true }
        });
        if (!user)
            throw new Error("Usuário não encontrado");
        const senhaValida = await bcrypt.compare(data.senhaAtual, user.senha);
        if (!senhaValida) {
            throw new Error("Senha atual incorreta");
        }
        const hashedPassword = await bcrypt.hash(data.novaSenha, SALT_ROUNDS);
        await prisma.usuario.update({
            where: { id: userId },
            data: { senha: hashedPassword }
        });
        await prisma.refreshToken.deleteMany({
            where: { userId }
        });
        return { message: "Senha alterada com sucesso. Faça login novamente." };
    }
    async refresh(refreshToken, res) {
        if (!refreshToken) {
            throw new Error("Refresh token não fornecido");
        }
        const stored = await prisma.refreshToken.findFirst({
            where: { token: refreshToken }
        });
        if (!stored || stored.expiresAt < new Date()) {
            throw new Error("Refresh token inválido ou expirado");
        }
        const newRefreshToken = generateRefreshToken();
        const newAccessToken = generateAccessToken(stored.userId);
        await prisma.$transaction([
            prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            }),
            prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: stored.userId,
                    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
                }
            })
        ]);
        res.cookie("accessToken", newAccessToken, {
            ...COOKIE_OPTIONS,
            maxAge: ACCESS_TOKEN_EXPIRY
        });
        res.cookie("refreshToken", newRefreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: REFRESH_TOKEN_EXPIRY
        });
        return { message: "Token atualizado com sucesso" };
    }
    async logout(req, res) {
        const refreshToken = req.cookies?.refreshToken;
        const accessToken = req.cookies?.accessToken;
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            });
        }
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, JWT_SECRET);
                await prisma.blacklistedToken.create({
                    data: {
                        token: accessToken,
                        expiresAt: new Date(decoded.exp * 1000)
                    }
                });
            }
            catch {
                console.log("token inválido ou expirado, apenas limpar cookies");
            }
        }
        res.clearCookie("accessToken", COOKIE_OPTIONS);
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        return res.json({ message: "Logout realizado com sucesso" });
    }
}
export default new AuthService();
//# sourceMappingURL=auth.service.js.map