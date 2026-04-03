import type { Request, Response } from 'express';
import AlunoService from '../services/aluno.service.js';

interface MulterRequest extends Request {
  files?: {
    biUrl?: Express.Multer.File[];
    comprovativoUrl?: Express.Multer.File[];
  };
}

class AlunoController {

  async createAluno(req: MulterRequest, res: Response) {
    try {
      const { nome, email, telefone, turmaId, status } = req.body;
      const files = req.files;

      if (!nome || !email || !telefone || !turmaId) {
        return res.status(400).json({
          error: 'Campos obrigatórios: nome, email, telefone, turmaId',
        });
      }

      if (!files?.biUrl?.[0] || !files?.comprovativoUrl?.[0]) {
        return res.status(400).json({
          error: 'Ficheiros obrigatórios: biUrl (BI), comprovativoUrl (Comprovativo)',
        });
      }

      const aluno = await AlunoService.create(
        {
          nome,
          email,
          telefone,
          turmaId,
          status,
        },
        {
          biUrl: files.biUrl,
          comprovativoUrl: files.comprovativoUrl,
        }
      );

      return res.status(201).json({
        success: true,
        message: 'Aluno criado com sucesso',
        data: aluno,
      });
    } catch (error: any) {
      console.error('[AlunoController] Erro ao criar aluno:', error);

      if (error.message.includes('já existe')) {
        return res.status(409).json({ error: error.message });
      }
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({
        error: 'Erro interno ao criar aluno',
        message: error.message,
      });
    }
  }

  async getAllAlunos(_req: Request, res: Response) {
    try {
      const alunos = await AlunoService.findAll();

      return res.json({
        success: true,
        count: alunos.length,
        data: alunos,
      });
    } catch (error: any) {
      console.error('[AlunoController] Erro ao listar alunos:', error);
      return res.status(500).json({
        error: 'Erro interno ao listar alunos',
      });
    }
  }

  async getAlunoById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const aluno = await AlunoService.findById(id);

      if (!aluno) {
        return res.status(404).json({
          error: 'Aluno não encontrado',
        });
      }

      return res.json({
        success: true,
        data: aluno,
      });
    } catch (error: any) {
      console.error('[AlunoController] Erro ao buscar aluno:', error);
      return res.status(500).json({
        error: 'Erro interno ao buscar aluno',
      });
    }
  }

  async deleteAluno(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const aluno = await AlunoService.delete(id);

      return res.json({
        success: true,
        message: 'Aluno removido com sucesso',
        data: {
          id: aluno.id,
          nome: aluno.nome,
        },
      });
    } catch (error: any) {
      console.error('[AlunoController] Erro ao deletar aluno:', error);

      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({
        error: 'Erro interno ao remover aluno',
      });
    }
  }

  async updateAluno(req: MulterRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const { nome, email, telefone, turmaId, status } = req.body;
      const files = req.files;

      const aluno = await AlunoService.update(
        id,
        {
          nome,
          email,
          telefone,
          turmaId,
          status,
        },
        files
      );

      return res.json({
        success: true,
        message: 'Aluno atualizado com sucesso',
        data: aluno,
      });
    } catch (error: any) {
      console.error('[AlunoController] Erro ao atualizar aluno:', error);

      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({
        error: 'Erro interno ao atualizar aluno',
      });
    }
  }
}

export default new AlunoController();