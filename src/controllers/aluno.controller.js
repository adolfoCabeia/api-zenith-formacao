import { Request, Response } from 'express';
import { AlunoService } from '../services/aluno.service.js';
import { uploadToCloudinary } from '../services/upload.service.js';


const alunoService = new AlunoService();


class AlunoController {
    async create(req, res) {
        try {
            const { nome, email, telefone, curso } = req.body;
            const files = req.files;
            if (!files?.bi || !files?.comprovativo) {
                return res.status(400).json({
                    message: 'BI e Comprovativo são obrigatórios'
                });
            }
            const biUpload = await uploadToCloudinary(files.bi[0].buffer);
            const comprovativoUpload = await uploadToCloudinary(files.comprovativo[0].buffer);
            const aluno = await alunoService.create({
                nome,
                email,
                telefone,
                curso,
                biUrl: biUpload.secure_url,
                comprovativoUrl: comprovativoUpload.secure_url
            });
            return res.status(201).json(aluno);
        }
        catch (error) {
            return res.status(400).json({
                message: error.message || 'Erro ao criar aluno'
            });
        }
    }
    async findAll(req, res) {
        try {
            const alunos = await alunoService.findAll();
            return res.json(alunos);
        }
        catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar alunos' });
        }
    }
    async findById(req, res) {
        try {
            const { id } = req.params;
            const aluno = await alunoService.findById(id);
            return res.json(aluno);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await alunoService.delete(id);
            return res.json({ message: 'Aluno removido com sucesso' });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}


export default AlunoController