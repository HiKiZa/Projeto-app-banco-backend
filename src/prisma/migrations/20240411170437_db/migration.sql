-- CreateTable
CREATE TABLE "Usuario" (
    "usu_id" SERIAL NOT NULL,
    "usu_nome" TEXT NOT NULL,
    "usu_email" TEXT NOT NULL,
    "usu_telefone" TEXT NOT NULL,
    "usu_dtNasc" TIMESTAMP(3) NOT NULL,
    "usu_senha" TEXT NOT NULL,
    "usu_cpf" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usu_id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "end_cep" TEXT NOT NULL,
    "end_rua" TEXT NOT NULL,
    "end_num" TEXT NOT NULL,
    "end_bairro" TEXT NOT NULL,
    "end_cidade" TEXT NOT NULL,
    "end_uf" TEXT NOT NULL,
    "end_complemento" TEXT NOT NULL,
    "end_id" SERIAL NOT NULL,
    "usu_id" INTEGER NOT NULL,
    "end_dtCriado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_dtModificado" TIMESTAMP(3),
    "end_ativo" BOOLEAN,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("end_id")
);

-- CreateTable
CREATE TABLE "Conta" (
    "con_id" SERIAL NOT NULL,
    "con_num" TEXT NOT NULL,
    "con_tipo" TEXT NOT NULL,
    "con_saldo" DOUBLE PRECISION NOT NULL,
    "con_senha" INTEGER NOT NULL,
    "usu_id" INTEGER NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("con_id")
);

-- CreateTable
CREATE TABLE "Agencia" (
    "con_id" INTEGER NOT NULL,
    "age_num" TEXT NOT NULL,
    "age_nome" TEXT NOT NULL,

    CONSTRAINT "Agencia_pkey" PRIMARY KEY ("age_nome")
);

-- CreateTable
CREATE TABLE "Transferencia" (
    "trans_id" SERIAL NOT NULL,
    "trans_remetente" INTEGER NOT NULL,
    "trans_destinatario" INTEGER NOT NULL,
    "trans_val" DOUBLE PRECISION NOT NULL,
    "trans_dtTrans" TIMESTAMP(3) NOT NULL,
    "trans_descricao" TEXT NOT NULL,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("trans_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usu_id_key" ON "Usuario"("usu_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usu_cpf_key" ON "Usuario"("usu_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_end_id_key" ON "Endereco"("end_id");

-- CreateIndex
CREATE UNIQUE INDEX "Conta_con_id_key" ON "Conta"("con_id");

-- CreateIndex
CREATE UNIQUE INDEX "Conta_con_num_key" ON "Conta"("con_num");

-- CreateIndex
CREATE UNIQUE INDEX "Conta_usu_id_key" ON "Conta"("usu_id");

-- CreateIndex
CREATE UNIQUE INDEX "Agencia_con_id_key" ON "Agencia"("con_id");

-- CreateIndex
CREATE UNIQUE INDEX "Agencia_age_nome_key" ON "Agencia"("age_nome");

-- CreateIndex
CREATE UNIQUE INDEX "Transferencia_trans_id_key" ON "Transferencia"("trans_id");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuario"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conta" ADD CONSTRAINT "Conta_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuario"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agencia" ADD CONSTRAINT "Agencia_con_id_fkey" FOREIGN KEY ("con_id") REFERENCES "Conta"("con_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_trans_destinatario_fkey" FOREIGN KEY ("trans_destinatario") REFERENCES "Conta"("con_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_trans_remetente_fkey" FOREIGN KEY ("trans_remetente") REFERENCES "Conta"("con_id") ON DELETE RESTRICT ON UPDATE CASCADE;
