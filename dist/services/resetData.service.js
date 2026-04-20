import { prisma } from "../config/prismaConfig.js";
async function resetData() {
    try {
        console.log("Limpando banco de dados...");
        await prisma.$transaction([
            prisma.pagamento.deleteMany(),
            prisma.aluno.deleteMany(),
            prisma.turma.deleteMany(),
            prisma.curso.deleteMany(),
        ]);
        console.log("Banco limpo com sucesso!");
    }
    catch (error) {
        console.error("Erro ao limpar banco:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
resetData();
//# sourceMappingURL=resetData.service.js.map