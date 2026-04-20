import type { Request, Response } from "express";
import AuthService from "../services/auth.service.js";

class AuthController {

  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Dados incompletos" });
      }

      const result = await AuthService.register(nome, email, senha);
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      res.status(201).json({
        message: "Usuário criado com sucesso",
        user: result.user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: "Dados incompletos" });
      }

      const result = await AuthService.login(email, senha);
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        message: "Login realizado com sucesso",
        user: result.user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token não fornecido" });
      }

      const result = await AuthService.refresh(refreshToken);

      res.cookie("accessToken", result.newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
      });
      res.cookie("refreshToken", result.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ message: "Token atualizado com sucesso" });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await AuthService.logout(req, res);
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

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ message: "Dados incompletos" });
      }

      const result = await AuthService.updatePassword(userId, { senhaAtual, novaSenha });
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AuthController();