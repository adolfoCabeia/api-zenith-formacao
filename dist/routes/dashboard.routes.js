import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
const dashRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints do dashboard
 */
/**
 * @swagger
 * /dashboard/count:
 *   get:
 *     summary: Retorna contagem geral do sistema
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Contagem retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuarios:
 *                       type: number
 *                     aluno:
 *                       type: number
 *                     turma:
 *                       type: number
 *                     curso:
 *                       type: number
 */
dashRouter.get("/count", dashboardController.count);
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retorna todos os dados do dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dados completos do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
dashRouter.get("/", dashboardController.calc);
export default dashRouter;
//# sourceMappingURL=dashboard.routes.js.map