import type { Request, Response } from "express";
import PagamentoService from "../services/pagamento.service.js";

class PagamentoController {
  async create(req: Request, res: Response) {
    try {
      const pagamento = await PagamentoService.create(req.body);
      return res.status(201).json({ message: "Pagamento criado com sucesso", pagamento });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Erro ao criar pagamento" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const pagamentos = await PagamentoService.findAll();
      return res.json(pagamentos);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar pagamentos" });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pagamento = await PagamentoService.findById(id);
      return res.json(pagamento);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pagamento = await PagamentoService.update(id, req.body);
      return res.json({ message: "Pagamento atualizado com sucesso", pagamento });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PagamentoService.delete(id);
      return res.json({ message: "Pagamento removido com sucesso" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new PagamentoController();