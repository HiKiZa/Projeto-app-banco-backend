import { PrismaClient } from "@prisma/client";
import { Agencia } from "dtos/AgenciaDTO";


const prisma = new PrismaClient();

export default class AgenciaModelo {

    criar = async (agencia: Agencia) => {
        return await prisma.agencia.create({
            data: {
                age_nome: agencia.age_nome,
                age_num: agencia.age_num,
            }
        });
    }

    buscarTodos = async () => {
        return await prisma.agencia.findMany();
    }

    buscarUm = async (age_nome: string) => {
        return await prisma.agencia.findUnique({
            where: {
                age_nome
            }
        });
    }

    excluir = async (age_nome: string) => {
        return await prisma.agencia.delete({
            where: {
                age_nome
            }
        });
    }

    alterar = async (age_nome: string, agencia: Agencia) => {
        return await prisma.agencia.update({
            where: {
                age_nome
            },
            data: {
                ...agencia
            }
        })
    }
}