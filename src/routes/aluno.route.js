import { Router } from "express";
import AlunoController from "../controllers/aluno.controller.js";
import upload from "../config/multer.js";


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
 *         id: "123e4567-e89b-12d3-a456-426614174002"
 *         nome: "João Silva"
 *         email: "joao@email.com"
 *         telefone: "923456789"
 *         biUrl: "https://res.cloudinary.com/.../bi.jpg"
 *         comprovativoUrl: "https://res.cloudinary.com/.../comprovativo.jpg"
 *         turmaId: "123e4567-e89b-12d3-a456-426614174001"
 *         status: "ativo"
 */

alunoRouter.get("/" ,AlunoController.getAllAlunos);

alunoRouter.get("/:id", AlunoController.getAlunoById);

alunoRouter.post(
  "/",
  upload.fields([
    { name: "biUrl", maxCount: 1 },
    { name: "comprovativoUrl", maxCount: 1 },
  ]),
  AlunoController.createAluno
);

alunoRouter.put(
  "/:id",
  upload.fields([
    { name: "biUrl", maxCount: 1 },
    { name: "comprovativoUrl", maxCount: 1 },
  ]),
  AlunoController.updateAluno
);

alunoRouter.delete("/:id", AlunoController.deleteAluno);

export default alunoRouter;