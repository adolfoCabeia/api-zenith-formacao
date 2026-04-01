import express, { Request, Response } from "express";
import cors from 'cors';
import alunoRouter from "./routes/aluno.route.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, resp) => {
    resp.json({ message: "API ZENITH RODANDO" });
});
app.use('/alunos', alunoRouter);
export default app;
//# sourceMappingURL=app.js.map