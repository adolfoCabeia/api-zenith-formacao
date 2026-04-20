import { Router } from 'express';
import CursoController from '../controllers/curso.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const cursoRouter = Router();
cursoRouter.use(authMiddleware);
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Endpoints para cursos
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - nome
 *         - preco
 *       properties:
 *         id:
 *           type: string
 *           description: ID do curso
 *         nome:
 *           type: string
 *           description: Nome do curso
 *         preco:
 *           type: number
 *           description: Preço do curso
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         nome: "Programação Front-end"
 *         preco: 150000
 */
/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Retorna todos os cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 */
cursoRouter.get("/", CursoController.getAllCursos);
/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Retorna um curso pelo ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso não encontrado
 */
cursoRouter.get("/:id", CursoController.getCursoById);
/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 */
cursoRouter.post("/", CursoController.createCurso);
/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Atualiza um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso atualizado
 */
cursoRouter.put("/:id", CursoController.updateCurso);
/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Deleta um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso deletado com sucesso
 */
cursoRouter.delete("/:id", CursoController.deleteCurso);
export default cursoRouter;
//# sourceMappingURL=curso.routes.js.map