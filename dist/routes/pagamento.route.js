import { Router } from "express";
import PagamentoController from "../controllers/pagamento.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const pagamentoRouter = Router();
pagamentoRouter.use(authMiddleware);
/**
 * @swagger
 * components:
 *   schemas:
 *     Pagamento:
 *       type: object
 *       required:
 *         - alunoId
 *         - valor
 *       properties:
 *         id:
 *           type: string
 *           description: ID do pagamento
 *         alunoId:
 *           type: string
 *           description: ID do aluno
 *         valor:
 *           type: integer
 *           description: Valor do pagamento
 *         status:
 *           type: string
 *           description: Status do pagamento
 *         data:
 *           type: string
 *           format: date-time
 *           description: Data do pagamento
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         alunoId: "456e7890-e12b-34d5-a678-987654321000"
 *         valor: 50000
 *         status: "pendente"
 *         data: "2026-03-30T12:00:00Z"
 */
/**
 * @swagger
 * /pagamentos:
 *   get:
 *     summary: Lista todos os pagamentos
 *     tags: [Pagamentos]
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pagamento'
 */
pagamentoRouter.get("/", PagamentoController.findAll);
/**
 * @swagger
 * /pagamentos/{id}:
 *   get:
 *     summary: Retorna um pagamento pelo ID
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Pagamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pagamento'
 *       404:
 *         description: Pagamento não encontrado
 */
pagamentoRouter.get("/:id", PagamentoController.findById);
/**
 * @swagger
 * /pagamentos:
 *   post:
 *     summary: Cria um novo pagamento
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pagamento'
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 */
pagamentoRouter.post("/", PagamentoController.create);
/**
 * @swagger
 * /pagamentos/{id}:
 *   put:
 *     summary: Atualiza um pagamento
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pagamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pagamento'
 *     responses:
 *       200:
 *         description: Pagamento atualizado com sucesso
 */
pagamentoRouter.put("/:id", PagamentoController.update);
/**
 * @swagger
 * /pagamentos/{id}:
 *   delete:
 *     summary: Deleta um pagamento
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Pagamento deletado com sucesso
 */
pagamentoRouter.delete("/:id", PagamentoController.delete);
export default pagamentoRouter;
//# sourceMappingURL=pagamento.route.js.map