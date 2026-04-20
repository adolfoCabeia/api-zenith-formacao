import { prisma } from "../config/prismaConfig.js";
const diasValidos = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo"
];
function validarDias(dias) {
    if (!Array.isArray(dias) || dias.length === 0) {
        throw new Error("Informe pelo menos um dia da semana");
    }
    const normalizados = dias.map(d => d.toLowerCase());
    const invalidos = normalizados.filter(d => !diasValidos.includes(d));
    if (invalidos.length > 0) {
        throw new Error(`Dias inválidos: ${invalidos.join(", ")}`);
    }
    return normalizados;
}
class TurmaService {
    async create(data) {
        if (!data.cursoId ||
            !data.diaSemana ||
            !data.horario ||
            !data.dataInicio ||
            !data.dataFim ||
            data.capacidade === undefined) {
            throw new Error("Todos os campos da turma são obrigatórios");
        }
        const curso = await prisma.curso.findUnique({
            where: { id: data.cursoId }
        });
        if (!curso)
            throw new Error("Curso não encontrado");
        const turma = await prisma.turma.create({
            data: {
                cursoId: data.cursoId,
                diaSemana: validarDias(data.diaSemana),
                horario: data.horario,
                dataInicio: new Date(data.dataInicio),
                dataFim: new Date(data.dataFim),
                capacidade: data.capacidade,
            },
            include: {
                curso: true,
                alunos: true
            }
        });
        return turma;
    }
    async findAll() {
        return await prisma.turma.findMany({
            orderBy: { dataInicio: 'desc' },
            include: { curso: true, alunos: true }
        });
    }
    async findById(id) {
        return await prisma.turma.findUnique({
            where: { id },
            include: { curso: true, alunos: true }
        });
    }
    async update(id, data) {
        return await prisma.turma.update({
            where: { id },
            data: {
                ...data,
                dataInicio: data.dataInicio ? new Date(data.dataInicio) : undefined,
                dataFim: data.dataFim ? new Date(data.dataFim) : undefined,
            },
            include: {
                curso: true,
                alunos: true
            }
        });
    }
    async delete(id) {
        return await prisma.turma.delete({
            where: { id },
            include: {
                curso: true
            }
        });
    }
}
export default new TurmaService();
//# sourceMappingURL=turma.service.js.map