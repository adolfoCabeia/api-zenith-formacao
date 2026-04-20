import turmaService from "../services/turma.service.js";
class TurmaController {
    async createTurma(req, res) {
        try {
            const turma = await turmaService.create(req.body);
            res.status(201).json({ message: "Turma criada com sucesso", dados: turma });
        }
        catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message || "Falha ao criar turma" });
        }
    }
    async getAllTurmas(req, res) {
        try {
            const turmas = await turmaService.findAll();
            res.status(200).json(turmas);
        }
        catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Falha ao listar turmas" });
        }
    }
    async getTurmaById(req, res) {
        try {
            const id = req.params.id;
            const turma = await turmaService.findById(id);
            if (!turma)
                return res.status(404).json({ message: "Turma não encontrada" });
            res.status(200).json(turma);
        }
        catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Falha ao buscar turma por ID" });
        }
    }
    async updateTurma(req, res) {
        try {
            const id = req.params.id;
            const turma = await turmaService.update(id, req.body);
            res.status(200).json({ message: "Turma atualizada com sucesso", dados: turma });
        }
        catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Falha ao atualizar turma" });
        }
    }
    async deleteTurma(req, res) {
        try {
            const id = req.params.id;
            await turmaService.delete(id);
            res.status(200).json({ message: "Turma removida com sucesso" });
        }
        catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Falha ao remover turma" });
        }
    }
}
export default new TurmaController();
//# sourceMappingURL=turma.controller.js.map