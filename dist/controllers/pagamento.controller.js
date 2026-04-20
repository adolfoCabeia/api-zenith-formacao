import PagamentoService from "../services/pagamento.service.js";
class PagamentoController {
    async create(req, res) {
        try {
            const pagamento = await PagamentoService.create(req.body);
            return res.status(201).json({ message: "Pagamento criado com sucesso", pagamento });
        }
        catch (error) {
            return res.status(400).json({ message: error.message || "Erro ao criar pagamento" });
        }
    }
    async findAll(req, res) {
        try {
            const pagamentos = await PagamentoService.findAll();
            return res.json(pagamentos);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao buscar pagamentos" });
        }
    }
    async findById(req, res) {
        try {
            const id = req.params.id;
            const pagamento = await PagamentoService.findById(id);
            return res.json(pagamento);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            const pagamento = await PagamentoService.update(id, req.body);
            return res.json({ message: "Pagamento atualizado com sucesso", pagamento });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id;
            await PagamentoService.delete(id);
            return res.json({ message: "Pagamento removido com sucesso" });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
export default new PagamentoController();
//# sourceMappingURL=pagamento.controller.js.map