import type { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {

  count: async (req: Request, res: Response) => {
    try {
      const data = await dashboardService.count();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar contagens do dashboard",
        error,
      });
    }
  },

  calc: async (req: Request, res: Response) => {
    try {
      const data = await dashboardService.calc();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao calcular dashboard",
        error,
      });
    }
  },
};