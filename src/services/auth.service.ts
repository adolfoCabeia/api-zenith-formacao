// services/auth.service.ts
import dotenv from 'dotenv'
dotenv.config()
import { prisma } from "../config/prismaConfig.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface UpdateProfileData {
  nome?: string;
  email?: string;
}

interface UpdatePasswordData {
  senhaAtual: string;
  novaSenha: string;
}

class AuthService {

  async register(nome: string, email: string, senha: string) {
    const userExists = await prisma.usuario.findUnique({ where: { email } });

    if (userExists) {
      throw new Error("Usuário já existe");
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return { user, token };
  }

  async login(email: string, senha: string) {
    const user = await prisma.usuario.findUnique({ 
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) throw new Error("Usuário não encontrado");

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) throw new Error("Senha inválida");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const { senha: _, ...userWithoutPassword } = user;

    return { 
      user: userWithoutPassword, 
      token 
    };
  }

  async getProfile(userId: string) {
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

    if (!user) throw new Error("Usuário não encontrado");

    return user;
  }

  // NOVO: Atualizar perfil (nome, email)
  async updateProfile(userId: string, data: UpdateProfileData) {
    // Verifica se email já existe (se estiver alterando)
    if (data.email) {
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

  // NOVO: Alterar senha
  async updatePassword(userId: string, data: UpdatePasswordData) {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { senha: true }
    });

    if (!user) throw new Error("Usuário não encontrado");

    // Verifica senha atual
    const senhaValida = await bcrypt.compare(data.senhaAtual, user.senha);

    if (!senhaValida) {
      throw new Error("Senha atual incorreta");
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(data.novaSenha, 10);

    await prisma.usuario.update({
      where: { id: userId },
      data: { senha: hashedPassword }
    });

    return { message: "Senha alterada com sucesso" };
  }
}

export default new AuthService();