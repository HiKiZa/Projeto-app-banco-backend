/*
  Warnings:

  - Added the required column `age_nome` to the `Conta` table without a default value. This is not possible if the table is not empty.
  - Made the column `end_ativo` on table `Endereco` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Agencia" DROP CONSTRAINT "Agencia_con_id_fkey";

-- DropIndex
DROP INDEX "Agencia_con_id_key";

-- AlterTable
ALTER TABLE "Conta" ADD COLUMN     "age_nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Endereco" ALTER COLUMN "end_ativo" SET NOT NULL,
ALTER COLUMN "end_ativo" SET DEFAULT true;

-- AddForeignKey
ALTER TABLE "Conta" ADD CONSTRAINT "Conta_age_nome_fkey" FOREIGN KEY ("age_nome") REFERENCES "Agencia"("age_nome") ON DELETE RESTRICT ON UPDATE CASCADE;
