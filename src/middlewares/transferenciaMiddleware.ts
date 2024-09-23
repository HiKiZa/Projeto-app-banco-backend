import { RequestHandler } from "express";
import { prismaClient } from "index";
import ContaModelo from "models/TransferenciaModelo";
import TransferenciaModelo from 'models/TransferenciaModelo';
import { StatusCodes } from 'http-status-codes';
import transferenciaUtils from "utils/transferenciaUtils";
import { usuarioUtils } from "utils/usuarioUtils";
import { manipulaErros } from "helpers/Erros";
import { Atributo, Tabela } from "dtos/ErrosDTO";

var erro = new manipulaErros();

export default class TransferenciaMiddleware {


    static validaTransferir: RequestHandler = async (req, res, next) => {
        var erro = new manipulaErros();
        try {
            let destinatario
            if (usuarioUtils.cpfValido(req.body.trans_destinatario)) {
                destinatario = await transferenciaUtils.cpfParaId(req.body.trans_destinatario)
            } else {
                destinatario = await transferenciaUtils.numParaId(req.body.trans_destinatario)
            }
            if (!destinatario) {
                throw erro.adicionaErro(Tabela.Transferencia, Atributo.id, 404, "Destinatario não encontrado")
            }
            const usu_id: number = req.body.usu_id
            req.body.destinatario = destinatario
            let contaRemetente = await prismaClient.conta.findUnique({
                where: { usu_id }
            })
            if (!contaRemetente) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.id, 404, "Usuário não encontrado")
            }
            if (req.body.trans_valor <= 0) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.Saldo, 400, "Insira um valor válido")
            } 
            if (contaRemetente.con_saldo <= req.body.trans_valor) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.Saldo, 400, "Saldo insuficiente")
            }
            let contaDestinatario = await prismaClient.conta.findUnique({
                where: {
                    //@ts-ignore
                    con_id: destinatario
                }
            }) 
            if (!contaDestinatario) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.id, 404, "Destinatário não encontrado")
            }
            if (contaRemetente.con_id == contaDestinatario.con_id) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.id, 400, "Não pode mandar para si mesmo")
            }
            if (contaRemetente.con_senha != req.body.con_senha) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.SenhaTrans, 400, "Senha incorreta")
            }
            if (erro.getErros.length == 0) {
                next();
            }
            else {
                throw erro.adicionaErro(Tabela.Transferencia, Atributo.id, 500, "Algo deu errado")
            }
        } catch (e) {
            //@ts-ignore
            res.status(erro.Erros[0].codigo).json({
                erro
            }    
            )
        } 

    }
}
