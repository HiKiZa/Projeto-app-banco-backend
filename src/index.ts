import "dotenv/config";
import express, { Request, Response } from 'express';
import UsuarioRotas from "routes/UsuarioRotas";
import TransferenciaRotas from "routes/TransferenciaRotas"
import AgenciaRotas from "routes/AgenciaRotas"
import ContaRotas from "routes/ContaRotas";
import EnderecoRotas from "routes/EnderecoRotas";
import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";
import { login } from "middlewares/login";
import UsuarioController from './controllers/UsuarioController';



DateTime.local().setZone("America/Sao_Paulo");
const usuarioController = new UsuarioController
const app = express();
export const prismaClient = new PrismaClient({
    log: ['query']
})

app.listen(process.env.PORT || 3344);

app.use(express.json());

app.use("/usuario",  UsuarioRotas);

app.use("/transferencia",  TransferenciaRotas);

app.use("/agencia",  AgenciaRotas);

app.use("/conta",  ContaRotas);

app.use("/login", login)

app.use("/esqueciSenha", usuarioController.esqueciSenha)

app.use("/endereco",  EnderecoRotas);



