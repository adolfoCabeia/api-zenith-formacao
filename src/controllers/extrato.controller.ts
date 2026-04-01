import type { Request, Response } from 'express';
import ExtratoService from '../services/extratoPdf.service.js';
import { enviarWhatsApp } from '../services/whatsapp.service.js';

class ExtratoController {

  async gerarExtrato(req: Request, res: Response) {
    try {
      const { tipo, alunoId, numeroWhatsApp } = req.body;

      if (!tipo || !numeroWhatsApp) {
        return res.status(400).json({
          message: "tipo e numeroWhatsApp são obrigatórios"
        });
      }

      const filePath = await ExtratoService.gerarPDF({
        tipo,
        alunoId
      });

      await enviarWhatsApp(numeroWhatsApp, filePath);

      return res.status(200).json({
        message: "Extrato enviado com sucesso"
      });

    } catch (error: any) {
      console.error("[ExtratoController]", error);

      return res.status(500).json({
        message: "Erro ao gerar/enviar extrato",
        error: error.message
      });
    }
  }
}

export default new ExtratoController();