import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { prisma } from '../config/prismaConfig.js';

interface ExtratoOptions {
  tipo: 'alunos' | 'pagamentos';
  alunoId?: string;
}

class ExtratoService {
  async gerarPDF(options: ExtratoOptions): Promise<string> {
    const doc = new PDFDocument();

    const filePath = path.join('temp', `extrato-${Date.now()}.pdf`);

    fs.mkdirSync('temp', { recursive: true });

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text('Extrato - Centro de Formação', { align: 'center' });
    doc.moveDown();

    if (options.tipo === 'alunos') {
      const alunos = await prisma.aluno.findMany({
        include: { turma: true }
      });

      if (alunos.length === 0) {
        doc.text('Não há alunos cadastrados.');
      } else {
        alunos.forEach((aluno, i) => {
          doc.text(
            `${i + 1}. ${aluno.nome} | ${aluno.email} | Turma: ${aluno.turma?.diaSemana}`
          );
        });
      }
    }

    if (options.tipo === 'pagamentos') {
      const pagamentos = options.alunoId
        ? await prisma.pagamento.findMany({
            where: { alunoId: options.alunoId },
            include: { aluno: true }
          })
        : await prisma.pagamento.findMany({
            include: { aluno: true }
          });

      if (pagamentos.length === 0) {
        doc.text('Não há pagamentos registrados.');
      } else {
        pagamentos.forEach((pag, i) => {
          doc.text(
            `${i + 1}. ${pag.aluno.nome} | Valor: ${pag.valor} | Status: ${pag.status}`
          );
        });
      }
    }

    doc.end();

    return filePath;
  }
}

export default new ExtratoService();