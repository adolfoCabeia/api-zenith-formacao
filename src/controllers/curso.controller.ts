import type { Request, Response } from 'express';
import cursoService from '../services/curso.service.js'

class CursoController {

    async createCurso(req: Request, resp: Response) {
        try {
            const curso = await cursoService.create(req.body)
            resp.status(201).json({ message: "Curso criado com sucesso", dados: curso })
        } catch (error) {
            console.log(error)
            resp.status(500).json({ message: "Falha ao criar o curso" })
        }
    }

    async getAllCursos(req: Request, resp: Response) {
        try {
            const cursos = await cursoService.findAll()
            resp.status(200).json(cursos)
        } catch (error) {
            console.log(error)
            resp.status(500).json({ message: "Falha ao listar cursos" })
        }
    }

    async getCursoById(req: Request, resp: Response) {
        try {
            const id = req.params.id as string;
            const curso = await cursoService.findById(id)
            if (!curso) {
                return resp.status(404).json({ message: "Curso não encontrado" })
            }
            resp.status(200).json(curso)
        } catch (error) {
            console.log(error)
            resp.status(500).json({ message: "Falha ao buscar curso por id" })
        }
    }

    async updateCurso(req: Request, resp: Response) {
        try {
            const id = req.params.id as string;
            const curso = await cursoService.update(id, req.body)
            resp.status(200).json({ message: "Curso atualizado com sucesso", dados: curso })
        } catch (error) {
            console.log(error)
            resp.status(500).json({ message: "Falha ao atualizar o curso" })
        }
    }

    async deleteCurso(req: Request, resp: Response) {
        try {
            const id = req.params.id as string;
            await cursoService.delete(id)
            resp.status(200).json({ message: "Curso removido com sucesso" })
        } catch (error) {
            console.log(error)
            resp.status(500).json({ message: "Falha ao remover o curso" })
        }
    }
}

export default new CursoController()