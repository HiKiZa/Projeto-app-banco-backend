import { RequestHandler } from "express";
import { prismaClient } from "index";
import ContaModelo from "models/TransferenciaModelo";
import TransferenciaModelo from 'models/TransferenciaModelo';
import { StatusCodes } from 'http-status-codes';
import { usuarioUtils } from "./usuarioUtils";
import { Transferencia } from "dtos/TransferenciaDTO";
import UsuarioModelo from "models/UsuarioModelo";
import { manipulaErros } from "helpers/Erros";
import { Atributo, Tabela } from "dtos/ErrosDTO";

var erro = new manipulaErros();

export default class transferenciaUtils {
    transferenciaModelo = new TransferenciaModelo();
    contaModelo = new ContaModelo();
    usuarioModelo = new UsuarioModelo();


    static async cpfParaId(campo: string) {
        
        if (usuarioUtils.cpfValido(campo)) {
            let usuario = await prismaClient.usuario.findUniqueOrThrow({
                where: {
                    usu_cpf: campo
                }
            })
            let conta = await prismaClient.conta.findUniqueOrThrow({
                where: {
                    usu_id: usuario.usu_id
                }
            })
            if (!conta) {
                return false
            }
            return conta.con_id
        }
    }

    static async numParaId(campo: string) {
        let conta = await prismaClient.conta.findFirst({
            where: {
                con_num: campo
            }
        })
        if (!conta) {
            return false
        }
        return conta.con_id
    }

    /* static validaTransferencia: RequestHandler = async (req, res) => {
        const usu_id: number = req.body.usu_id
        erro = new manipulaErros();
        let contaRemetente = await prismaClient.conta.findUnique({
            where: { usu_id }
        })
        try {
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
                    con_id: req.body.destinatario
                }
            })
            if (!contaDestinatario) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.id, 404, "Destinatário não encontrado")
            }
            //@ts-ignore
            if (contaRemetente.con_id == contaDestinatario.con_id) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.id, 400, "Não pode mandar para si mesmo")
            }
            //@ts-ignore
            if (contaRemetente.con_senha != req.body.con_senha) {
                throw erro.adicionaErro(Tabela.Conta, Atributo.SenhaTrans, 400, "Senha incorreta")
            }
            if(erro.getErros.length == 0){
                return true
            }
            else{
                throw erro.adicionaErro(Tabela.Transferencia, Atributo.id, 500, "Algo deu errado")
            }
        } catch (e) {
            console.log(e)
        }

    } */

    static presenteTrans: RequestHandler = async (req, res, next) => {
        const erro = new manipulaErros
        const usu_id: number = req.body.usu_id
        try {
            let conta = await prismaClient.conta.findUnique({ 
                where: { usu_id }
            })
            const id = parseInt(req.params.id)
            let transferencia = await prismaClient.transferencia.findUnique({
                where: {
                    trans_id: id
                }
            })
            if (!transferencia) {
                throw erro.adicionaErro(Tabela.Transferencia, Atributo.id, 404, "Transferencia não encontrado")
            }
            if (transferencia.trans_destinatario == conta?.con_id || transferencia.trans_remetente == conta?.con_id) {
                next();
            } else {
                throw erro.adicionaErro(Tabela.Conta, Atributo.id, 401, "Transferência não acessível")
            }

        } catch (e) {
            res.status(401).json({erro})
        }

    }

    static tipoTrans(con_id: number, transferencia: Transferencia) {
        if (con_id == transferencia.trans_destinatario) {
            return "entrada"
        }
        if (con_id == transferencia.trans_remetente) {
            return "saida"
        }
    }

    static async buscarDestinatario(transferencia: Transferencia) {
        const contaDestinatario = await prismaClient.conta.findUnique({
            where: {
                con_id: transferencia.trans_destinatario
            }
        })
        const destinatario = await prismaClient.usuario.findUnique({
            where: {
                usu_id: contaDestinatario?.usu_id
            }
        })
        console.log(destinatario)
        if (destinatario) {
            return destinatario.usu_nome
        }
        else {
            return ""
        }
    }

    static async buscarRemetente(transferencia: Transferencia) {
        const contaRemetente = await prismaClient.conta.findFirst({
            where: {
                con_id: transferencia.trans_remetente
            }
        })
        const remetente = await prismaClient.usuario.findUnique({
            where: {
                usu_id: contaRemetente?.usu_id
            }
        })
        console.log(remetente)
        if (remetente) {
            return remetente.usu_nome
        }
        else {
            return ""
        }
    }


}
