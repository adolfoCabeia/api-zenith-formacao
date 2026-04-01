import type { Request, Response } from "express";
import AuthService from "../services/auth.service.js";

class AuthController {

  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      const user = await AuthService.register(nome, email, senha);

      res.status(201).json({
        message: "Usuário criado com sucesso",
        user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      const result = await AuthService.login(email, senha);

      res.json({
        message: "Login realizado com sucesso",
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AuthController();