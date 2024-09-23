import { PrismaClient } from "@prisma/client";
import { Endereco } from '../dtos/EnderecoDTO';

const prisma = new PrismaClient();

export default class EnderecoModelo {

    criar = async (endereco: Endereco, usu_id: number) => {
        const dtCriado = new Date();
        return await prisma.endereco.create({
          data: {
            end_cep: endereco.end_cep,
            end_rua: endereco.end_rua,
            end_num: endereco.end_num,
            end_bairro: endereco.end_bairro,
            end_cidade: endereco.end_cidade,
            end_uf: endereco.end_uf,
            end_complemento: endereco.end_complemento,
            usu_id: usu_id,
            end_dtCriado: dtCriado,
        }
        });
      }
    
    buscarTodos = async () => {
        return await prisma.endereco.findMany();
    }

    buscarUm = async (end_id:number) => {
        return await prisma.endereco.findUnique ({
            where: {
                end_id
            }
        })
    }

    buscarUsu = async (usu_id:number) => {
        return await prisma.endereco.findMany ({
            where: {
                usu_id: usu_id,
                AND : {
                end_ativo: true
            },
            }, select: {
                end_cep: true,
                end_bairro: true,
                end_cidade: true,
                end_rua: true,
                end_num: true,
                end_uf: true,
                end_complemento: true,
                end_ativo: true
            }
        })
    }

    excluir = async (end_id: number) => {
        return await prisma.endereco.delete({
            where:{
                end_id
            }
        })
    }

    alterar = async (end_id: number, endereco: Endereco) => {
        return await prisma.endereco.update ({
            where: {
                end_id
            },
            data: {
                ...endereco
            }
        })
    }

    alterarAtivo = async (usu_id: number) => {
        return await prisma.endereco.updateMany ({
            where: {
                usu_id: usu_id
            },
            data: {
                end_ativo : false
            }
        })
    }

    excluirTudo = async (usu_id: number) => {
        return await prisma.endereco.deleteMany({
            where:{
                usu_id
            }
        })
    }
}