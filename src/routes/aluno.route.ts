import { Router } from "express";
import AlunoController from "../controllers/aluno.controller.js";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const alunoRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - telefone
 *         - turmaId
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         telefone:
 *           type: string
 *         biUrl:
 *           type: string
 *         comprovativoUrl:
 *           type: string
 *         turmaId:
 *           type: string
 *         status:
 *           type: string
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         nome: "Adolfo Cabeia"
 *         email: "adolfo@example.com"
 *         telefone: "923456789"
 *         biUrl: "https://res.cloudinary.com/.../bi.jpg"
 *         comprovativoUrl: "https://res.cloudinary.com/.../comprovativo.jpg"
 *         turmaId: "uuid-da-turma"
 *         status: "ativo"
 */

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cria um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               turmaId:
 *                 type: string
 *               biUrl:
 *                 type: string
 *                 format: binary
 *               comprovativoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 */
alunoRouter.post(
  "/",
  upload.fields([
    { name: "biUrl", maxCount: 1 },
    { name: "comprovativoUrl", maxCount: 1 },
  ]),
  AlunoController.createAluno
);

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 */
alunoRouter.get("/", authMiddleware ,AlunoController.getAllAlunos);

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Retorna um aluno pelo ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 */
alunoRouter.get("/:id", authMiddleware,AlunoController.getAlunoById);

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Remove um aluno
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aluno removido com sucesso
 */
alunoRouter.delete("/:id", authMiddleware,AlunoController.deleteAluno);

// Adicionar no fim do alunoRouter.ts

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza um aluno existente
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               turmaId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, ATIVO, INATIVO]
 *               biUrl:
 *                 type: string
 *                 format: binary
 *               comprovativoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Aluno atualizado
 */
alunoRouter.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "biUrl", maxCount: 1 },
    { name: "comprovativoUrl", maxCount: 1 },
  ]),
  AlunoController.updateAluno
);
export default alunoRouter;