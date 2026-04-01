/*
  Warnings:

  - The `status` column on the `Aluno` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `diaSemana` column on the `Turma` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusAluno" AS ENUM ('PENDENTE', 'REJEITADO', 'APROVADO');

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "status",
ADD COLUMN     "status" "StatusAluno" NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "Turma" DROP COLUMN "diaSemana",
ADD COLUMN     "diaSemana" TEXT[];
