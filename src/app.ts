import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import type { Request, Response } from "express";
//import { GeminiAgent } from './mcp/ai/geminiAgents.js';
import cors from 'cors'
import alunoRouter from "./routes/aluno.route.js"
import chatRouter from './routes/chat.routes.js';
import cursoRouter from './routes/curso.routes.js';
import { setupSwagger } from './config/swagger.js';
import turmaRouter from './routes/turma.routes.js';
import pagamentoRouter from './routes/pagamento.route.js';
import authRouter from './routes/auth.route.js';
import dashRouter from './routes/dashboard.routes.js';
//import extratoRouter from './routes/extrato.route.js';

const app = express()
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.json())

app.get('/', (req:Request,resp:Response)=>{
    resp.json({message: "API ZENITH RODANDO"})
})

/* async function main() {
  const agent = new GeminiAgent('./src/mcp/server.ts');
  
  try {
    await agent.initialize();
    
    const resposta = await agent.chat('Liste todos os alunos');
    console.log(resposta);
    
  } finally {
    await agent.destroy();
  }
}
main().catch(console.error); */

app.use('/alunos', alunoRouter)
app.use('/api', chatRouter);
app.use("/cursos", cursoRouter);
app.use('/turmas', turmaRouter)
app.use('/pagamentos', pagamentoRouter)
app.use('/auth', authRouter)
app.use("/dashboard", dashRouter);
//app.use('/extratos', extratoRouter)

setupSwagger(app);

export default app