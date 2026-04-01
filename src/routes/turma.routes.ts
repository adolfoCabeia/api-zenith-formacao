import { Router } from "express";
import TurmaController from "../controllers/turma.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const turmaRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Turma:
 *       type: object
 *       required:
 *         - cursoId
 *         - diaSemana
 *         - horario
 *         - dataInicio
 *         - dataFim
 *         - capacidade
 *       properties:
 *         id:
 *           type: string
 *           description: ID da turma
 *         cursoId:
 *           type: string
 *           description: ID do curso associado
 *         diaSemana:
 *           type: string
 *         horario:
 *           type: string
 *         dataInicio:
 *           type: string
 *           format: date-time
 *         dataFim:
 *           type: string
 *           format: date-time
 *         capacidade:
 *           type: integer
 *         alunos:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174001"
 *         cursoId: "123e4567-e89b-12d3-a456-426614174000"
 *         diaSemana: "Segunda-feira"
 *         horario: "18:00 - 20:00"
 *         dataInicio: "2026-04-01T18:00:00Z"
 *         dataFim: "2026-07-01T20:00:00Z"
 *         capacidade: 20
 *         alunos: []
 */

/**
 * @swagger
 * /turmas:
 *   get:
 *     summary: Retorna todas as turmas
 *     tags: [Turmas]
 *     responses:
 *       200:
 *         description: Lista de turmas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turma'
 */
turmaRouter.get("/", TurmaController.getAllTurmas);

/**
 * @swagger
 * /turmas/{id}:
 *   get:
 *     summary: Retorna uma turma pelo ID
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turma'
 *       404:
 *         description: Turma não encontrada
 */
turmaRouter.get("/:id", authMiddleware,TurmaController.getTurmaById);

/**
 * @swagger
 * /turmas:
 *   post:
 *     summary: Cria uma nova turma
 *     tags: [Turmas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turma'
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 */
turmaRouter.post("/", authMiddleware,TurmaController.createTurma);

/**
 * @swagger
 * /turmas/{id}:
 *   put:
 *     summary: Atualiza uma turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turma'
 *     responses:
 *       200:
 *         description: Turma atualizada
 */
turmaRouter.put("/:id", authMiddleware,TurmaController.updateTurma);

/**
 * @swagger
 * /turmas/{id}:
 *   delete:
 *     summary: Deleta uma turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma deletada com sucesso
 */
turmaRouter.delete("/:id", authMiddleware,TurmaController.deleteTurma);

export default turmaRouter;