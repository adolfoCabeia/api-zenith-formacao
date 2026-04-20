import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import type { Request, Response } from "express";
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

// Importações de Rotas
import alunoRouter from "./routes/aluno.route.js"
import chatRouter from './routes/chat.routes.js';
import cursoRouter from './routes/curso.routes.js';
import { setupSwagger } from './config/swagger.js';
import turmaRouter from './routes/turma.routes.js';
import pagamentoRouter from './routes/pagamento.route.js';
import authRouter from './routes/auth.route.js';
import dashRouter from './routes/dashboard.routes.js';

const app = express()

app.use(helmet())
app.use(cors({
  origin: [process.env.FRONTEND_URL || '', 'http://localhost:3000'], 
  credentials: true
}))

app.use(express.json())
app.use(cookieParser()) 

app.get('/', (req: Request, resp: Response) => {
  resp.json({ message: "API ZENITH RODANDO" })
})

app.use('/alunos', alunoRouter)
app.use('/api', chatRouter);
app.use("/cursos", cursoRouter);
app.use('/turmas', turmaRouter)
app.use('/pagamentos', pagamentoRouter)
app.use('/auth', authRouter)
app.use("/dashboard", dashRouter);


setupSwagger(app);

export default app