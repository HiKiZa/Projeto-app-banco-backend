import { PrismaClient } from "@prisma/client";
import { Conta } from "dtos/ContaDTO";
import { Usuario } from '../dtos/UsuarioDTO';

const prisma = new PrismaClient();

export default class ContaModelo {

    criar = async (conta: Conta) => {
        return await prisma.conta.create({
            data:{
                usu_id: conta.usu_id,
                con_num: conta.con_num,
                con_tipo: conta.con_tipo,
                con_saldo: conta.con_saldo,
                con_senha: conta.con_senha,
                age_nome: conta.age_nome
            } 
        });
    }

    buscarTodos = async () => {
        return await prisma.conta.findMany();
    }

    buscarUm = async (con_id: number) => {
        return await prisma.conta.findUnique({
            where: {
                con_id
            }
        });
    }

    buscarPorUsuario = async (usu_id: number) => {
        return await prisma.conta.findUnique({
            where: {
                usu_id
            }
        })
    }

    excluir = async (con_id: number) => {
        return await prisma.conta.delete({
            where: {
                con_id
            }
        });
    }

    alterar = async (con_id: number, conta: Conta) => {
        return await prisma.conta.update({
            where: {
                con_id
            },
            data: {
                ...conta
            }
        })
    }

    buscarTransferencias = async (trans_remetente: number, trans_destinatario: number) => {
        return await prisma.conta.findMany({
            where: {
                con_id: trans_destinatario || trans_remetente
            }
        })
    }

    getConta = async (usu_id: number) => {
        const conta = await prisma.conta.findUnique({
            where: { usu_id }
        })
        return conta
    }

    static idParaNome = async (con_id: number) => {
        const conta = await prisma.conta.findUnique({
            where: {
                con_id
            }
        });
        const usuario = await prisma.usuario.findUnique({
            where: {
                usu_id: conta?.usu_id
            }
        })
        return usuario?.usu_nome
    }

    alterarSenha = async (con_id: number, senhaNova: number) => {
        return await prisma.conta.update({
            where: {
              con_id: con_id
            }, data: {
              con_senha: senhaNova
            }
          })
    }
}