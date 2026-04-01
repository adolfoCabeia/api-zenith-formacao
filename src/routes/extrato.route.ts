import { Router } from 'express';
import ExtratoController from '../controllers/extrato.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const extratoRouter = Router();


extratoRouter.use(authMiddleware)
/**
 * @swagger
 * /extrato:
 *   post:
 *     summary: Gera extrato em PDF e envia pelo WhatsApp
 *     tags: [Extrato]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [alunos, pagamentos]
 *                 description: Tipo de extrato
 *               alunoId:
 *                 type: string
 *                 description: Opcional para extrato de um aluno específico
 *               numeroWhatsApp:
 *                 type: string
 *                 description:" Número no formato internacional (ex: +2449xxxxxxx)"
 *             required:
 *               - tipo
 *               - numeroWhatsApp
 *     responses:
 *       200:
 *         description: Extrato enviado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
extratoRouter.post('/', ExtratoController.gerarExtrato);

export default extratoRouter;