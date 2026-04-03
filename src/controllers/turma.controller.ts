import type { Request, Response } from "express";
import turmaService from "../services/turma.service.js";

class TurmaController {
  async createTurma(req: Request, res: Response) {
    try {
      const turma = await turmaService.create(req.body);
      res.status(201).json({ message: "Turma criada com sucesso", dados: turma });
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ message: error.message || "Falha ao criar turma" });
    }
  }

  async getAllTurmas(req: Request, res: Response) {
    try {
      const turmas = await turmaService.findAll();
      res.status(200).json(turmas);
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ message: "Falha ao listar turmas" });
    }
  }

  async getTurmaById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const turma = await turmaService.findById(id);
      if (!turma) return res.status(404).json({ message: "Turma não encontrada" });
      res.status(200).json(turma);
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ message: "Falha ao buscar turma por ID" });
    }
  }

  async updateTurma(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const turma = await turmaService.update(id, req.body);
      res.status(200).json({ message: "Turma atualizada com sucesso", dados: turma });
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ message: "Falha ao atualizar turma" });
    }
  }

  async deleteTurma(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await turmaService.delete(id);
      res.status(200).json({ message: "Turma removida com sucesso" });
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ message: "Falha ao remover turma" });
    }
  }
}

export default new TurmaController();