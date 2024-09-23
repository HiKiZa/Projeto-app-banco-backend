import { Prisma, PrismaClient } from "@prisma/client";
import { Transferencia } from "dtos/TransferenciaDTO";


const prisma = new PrismaClient();

export default class TransferenciaModelo {

    criar = async (transferencia: Transferencia) => {
        return await prisma.transferencia.create({
            data: transferencia
        });
    }

    buscarTodos = async () => {
        return await prisma.transferencia.findMany();
    }

    buscarUm = async (trans_id: number) => {
        return await prisma.transferencia.findUnique({
            where: {
                trans_id
            }
        });
    }

    excluir = async (trans_id: number) => {
        return await prisma.transferencia.delete({
            where: {
                trans_id
            }
        });
    }

    alterar = async (trans_id: number, transferencia: Transferencia) => {
        return await prisma.transferencia.update({
            where: {
                trans_id
            },
            data: {
                ...transferencia
            }
        })
    }

    buscarExtratos = async (con_id: number, dataInicial: Date, dataFinal: Date, pagina: number, registrosPorPagina: number, filtro: Prisma.SortOrder) => {
        if (!dataInicial) {
            dataInicial = new Date(500000000000);
        }
        if (!dataFinal) {
            dataFinal = new Date()
        }
        return await prisma.transferencia.findMany({
            where: {
                OR:
                    [{ trans_destinatario: con_id },
                    { trans_remetente: con_id }],
                AND: {
                    trans_dtTrans: {
                        gte: dataInicial,
                        lte: dataFinal
                    },
                },
            }, orderBy: {
                trans_dtTrans: filtro
            },
            skip: (pagina - 1) * registrosPorPagina,
            take: registrosPorPagina,
        })
    }
}
