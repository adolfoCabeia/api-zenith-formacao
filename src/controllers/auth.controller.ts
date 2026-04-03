import type { Request, Response } from "express";
import AuthService from "../services/auth.service.js";

class AuthController {

  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;
      const { user, token } = await AuthService.register(nome, email, senha);

      res.status(201).json({
        message: "Usuário criado com sucesso",
        user,
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;
      const { user, token } = await AuthService.login(email, senha);

      res.json({
        message: "Login realizado com sucesso",
        user,
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const user = await AuthService.getProfile(userId);

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const { nome, email } = req.body;
      const user = await AuthService.updateProfile(userId, { nome, email });

      res.json({
        message: "Perfil atualizado com sucesso",
        user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const { senhaAtual, novaSenha } = req.body;
      
      await AuthService.updatePassword(userId, { senhaAtual, novaSenha });

      res.json({
        message: "Senha alterada com sucesso",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AuthController();