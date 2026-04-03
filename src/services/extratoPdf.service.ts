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

    if (!fs.existsSync('temp')) {
      fs.mkdirSync('temp', { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text('Extrato - Centro de Formação', { align: 'center' });
    doc.moveDown();

    if (options.tipo === 'alunos') {
      const alunos = await prisma.aluno.findMany({
        include: { 
          turma: {
            include: { curso: true }
          }
        }
      });

      if (alunos.length === 0) {
        doc.text('Não há alunos cadastrados.');
      } else {
        alunos.forEach((aluno, i) => {
          const turmaInfo = aluno.turma 
            ? `${aluno.turma.curso?.nome || 'Curso'} - ${aluno.turma.diaSemana.join(', ')}`
            : 'Sem turma';
          
          doc.text(
            `${i + 1}. ${aluno.nome} | ${aluno.email} | Turma: ${turmaInfo}`
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
          const valorFormatado = typeof pag.valor === 'number' 
            ? `AOA ${pag.valor.toFixed(2)}`
            : pag.valor;
          
          doc.text(
            `${i + 1}. ${pag.aluno.nome} | Valor: ${valorFormatado} | Status: ${pag.status}`
          );
        });
      }
    }

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    });
  }
}

export default new ExtratoService();