import dotenv from 'dotenv'
dotenv.config()
import { prisma } from "../config/prismaConfig.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    });

    return user;
  }

  async login(email: string, senha: string) {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) throw new Error("Usuário não encontrado");

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) throw new Error("Senha inválida");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return { token };
  }
}

export default new AuthService();