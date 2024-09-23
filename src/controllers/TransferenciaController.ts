
import { Request, Response, NextFunction } from "express";
import { Transferencia } from '../dtos/TransferenciaDTO';
import TransferenciaModelo from "models/TransferenciaModelo"
import { PrismaClient } from "@prisma/client";
import transferenciaUtils from '../utils/transferenciaUtils';
import ContaModelo from "models/ContaModelo";
import { Atributo, Tabela } from "dtos/ErrosDTO";
import { manipulaErros } from "helpers/Erros";
import UsuarioModelo from "models/UsuarioModelo";
import AgenciaModelo from "models/AgenciaModelo";






const transferenciaModelo = new TransferenciaModelo();
const contaModelo = new ContaModelo();
const prismaClient = new PrismaClient();
const usuarioModelo = new UsuarioModelo();
const agenciaModelo = new AgenciaModelo();
const erros = new manipulaErros();


export default class TransferenciaController {

    criar = async (req: Request, res: Response) => {
        try {
            const transferencia: Transferencia = req.body;
            const novaTransferencia: Transferencia = await transferenciaModelo.criar(transferencia);
            res.status(201).send(novaTransferencia);
        } catch (e) {
            console.log("Não foi possível criar uma transferencia", e);
            res.status(500).send({
                error: "USR-01",
                message: "Não foi possível criar uma transferencia"
            });
        }
    };
    buscar = async (req: Request, res: Response) => {
        try {
            const trans_id: number = parseInt(req.params.id);
            const novaTransferencia: Transferencia | null = await transferenciaModelo.buscarUm(trans_id);

            if (novaTransferencia) {
                res.status(200).send({ novaTransferencia });
            } else {
                res.status(404).send({
                    error: "USR-06 ",
                    message: "Transferencia não encontrada"
                });
            }
        } catch (e) {
            console.log("Transferencia não encontrada", e);
            res.status(404).send({
                error: "USR-02",
                message: "Transferencia não encontrada"
            })
        }
    }

    buscarTodos = async (req: Request, res: Response) => {
        try {
            const transferencia: Transferencia[] | null = await transferenciaModelo.buscarTodos();
            console.log(transferencia)
            res.status(200).send({ transferencia });
        } catch (e) {
            console.log("Não foi possível buscar todas as transferencias", e);
            res.status(500).send({
                error: "USR-03",
                message: "Não foi possível buscar todas as transferencias",
            });
        }
    }

    atualizar = async (req: Request, res: Response) => {
        try {
            const trans_id: number = parseInt(req.params.id);
            const alterarTransferencia: Transferencia = req.body;
            const transferenciaAlerada: Transferencia | null = await transferenciaModelo.alterar(
                trans_id,
                alterarTransferencia
            );
            if (transferenciaAlerada) {
                res.status(200).send({ transferenciaAlerada });
            } else {
                res.send({ erros })
            }
        } catch (e) {
            console.log("Não foi possível alterar a Transferencia", e);
            res.status(500).send({
                error: "USR-04",
                message: "Não foi possível alterar a Transferencia",
            });
        }
    }

    excluir = async (req: Request, res: Response) => {
        try {
            const trans_id: number = parseInt(req.params.id);
            const TransferenciaExcluida = await transferenciaModelo.excluir(trans_id);
            res.status(204).send(TransferenciaExcluida);
        } catch (e) {
            console.log("Não foi possível excluir a Transferencia", e);
            res.status(500).send({
                error: "USR-05",
                message: "Não foi possível excluir a Transferencia",
            });
        }
    };


    transferir = async (req: Request, res: Response) => {
        try {
            let dateTime = new Date();
            const usu_id = req.body.usu_id;

            const contaRemetente = await prismaClient.conta.findUnique({
                where: {
                    usu_id
                }
            });
            const contaDestinatario = await prismaClient.conta.findUnique({
                where: {
                    con_id: req.body.destinatario
                }
            });

            await prismaClient.conta.update({
                where: {
                    usu_id
                },
                data: {
                    //@ts-ignore
                    con_saldo: contaRemetente.con_saldo - req.body.trans_valor
                }
            });
            await prismaClient.conta.update({
                where: {
                    con_id: req.body.destinatario
                },
                data: {
                    //@ts-ignore
                    con_saldo: contaDestinatario.con_saldo + req.body.trans_valor
                }
            });
            const transferencia = await prismaClient.transferencia.create({
                data: {
                    //@ts-ignore
                    trans_remetente: contaRemetente.con_id,
                    //@ts-ignore
                    trans_destinatario: contaDestinatario.con_id,
                    trans_val: req.body.trans_valor,
                    trans_dtTrans: dateTime,
                    trans_descricao: req.body.trans_descricao
                }
            });
            if (!transferencia) {
                return erros.adicionaErro(Tabela.Transferencia, Atributo.id, 500, "Transferência não concluída")
            }
            else {
                res.status(200).send({ transferencia, mensagem: "Transferencia bem sucedida" });
            }
        }
        catch (e) {
            console.log("Não foi possível realizar a transferencia", e);
            res.status(500).send({
                error: "USR-03",
                message: "Não foi possível realizar a transferencia",
            });
        }
    };
    buscarDetalhes = async (req: Request, res: Response) => {
        try {
            const conta = await prismaClient.conta.findUnique({
                where: {
                    usu_id: req.body.usu_id
                }
            })
            const trans_id: number = parseInt(req.params.id);
            const novaTransferencia: Transferencia | null = await transferenciaModelo.buscarUm(trans_id);
            if (novaTransferencia) {
                //@ts-ignore
                const tipo = transferenciaUtils.tipoTrans(conta.con_id, novaTransferencia)
                const valor = novaTransferencia.trans_val
                const data = novaTransferencia.trans_dtTrans
                const descricao = novaTransferencia.trans_descricao
                const destinatario = await transferenciaUtils.buscarDestinatario(novaTransferencia)
                const remetente = await transferenciaUtils.buscarRemetente(novaTransferencia)
                res.send({ tipo, valor, destinatario, remetente, data, descricao });
            } else {
                res.status(404).send({
                    error: "USR-06 ",
                    message: "Transferencia não encontrada"
                });
            }
        } catch (e) {
            console.log("Transferencia não encontrada", e);
            res.status(404).send({
                error: "USR-02",
                message: "Transferencia não encontrada"
            })
        }
    }

    infoTrans = async (req: Request, res: Response) => {
        const erros = new manipulaErros()
        try {
            let nomeRemetente;
            let cpfDestinatario;
            let nomeDestinatario;
            let nomeBanco;
            let numeroAgencia;
            let numeroConta;
            let conId;
            const conta = await contaModelo.buscarPorUsuario(req.body.usu_id);
            if (conta) {
                const contaNum = req.query.num;
                const contaCpf = req.query.cpf;
                let destinatarioId: number
                if (contaNum) {
                    //@ts-ignore
                    destinatarioId = await transferenciaUtils.numParaId(contaNum);
                } else {
                    if (contaCpf) {
                        //@ts-ignore
                        destinatarioId = await transferenciaUtils.cpfParaId(contaCpf);
                        
                    } else {
                        throw erros.adicionaErro(Tabela.Transferencia, Atributo.id, 400, "Cpf ou número da conta incorreto");
                    }
                }
                if (destinatarioId) {
                    const destinatario = await contaModelo.buscarUm(destinatarioId);
                    if (destinatario) {
                        if (destinatario.usu_id == conta.usu_id || destinatario.con_num == conta.con_num) {
                            throw erros.adicionaErro(Tabela.Conta, Atributo.Geral, 400, "Digite um número de conta/cpf que não seja o seu")
                        }
                        const dest = await usuarioModelo.buscarUm(destinatario.usu_id);
                        const agencia = await agenciaModelo.buscarUm(destinatario.age_nome);
                        const rem = await usuarioModelo.buscarUm(conta.usu_id)
                        if (agencia) {
                            if (dest) {
                                if (rem) {
                                    nomeRemetente = rem.usu_nome;
                                    cpfDestinatario = dest.usu_cpf;
                                    nomeDestinatario = dest.usu_nome;
                                    nomeBanco = agencia.age_nome;
                                    numeroAgencia = agencia.age_num;
                                    numeroConta = conta.con_num;
                                    conId = destinatarioId;
                                    res.send({ nomeRemetente, cpfDestinatario, nomeDestinatario, nomeBanco, numeroAgencia, numeroConta, conId })
                                } else {
                                    throw erros.adicionaErro(Tabela.Conta, Atributo.Geral, 404, "Remetente não encontrado")
                                }
                            } else {
                                throw erros.adicionaErro(Tabela.Conta, Atributo.id, 404, "Destinatário não encontrado");
                            }
                        } else {
                            throw erros.adicionaErro(Tabela.Agencia, Atributo.Nome, 404, "Agencia não encontrada");
                        }
                    } else {
                        throw erros.adicionaErro(Tabela.Conta, Atributo.id, 404, "Destinatário não encontrado");
                    }
                } else {
                    throw erros.adicionaErro(Tabela.Transferencia, Atributo.id, 400, "Cpf ou número da conta incorreto");
                }

            } else {
                throw erros.adicionaErro(Tabela.Conta, Atributo.Geral, 404, "Conta não encontrada");
            }
        } catch (e) {
            res.status(500).json({ erros })
        }
    }

    buscarExtratos = async (req: Request, res: Response) => {
        try {
            const conta = await contaModelo.buscarPorUsuario(req.body.usu_id)
            const dataInicial = req.query.dtInicial;
            const dataFinal = req.query.dtFinal;
            const pagina = parseInt(req.params.pagina);
            const registrosPorPagina = req.query.qtd;
            //const registrosPorPagina = req.body.qtd;
            var filtro = req.query.filtro;
            if (!filtro) {
                filtro = 'asc';
            }
            //@ts-ignore
            const resultado = await transferenciaModelo.buscarExtratos(conta.con_id, dataInicial, dataFinal, pagina, parseInt(registrosPorPagina), filtro)
            console.log(resultado)
            if (!resultado) {
                throw erros.adicionaErro(Tabela.Usuario, Atributo.Geral, 404, "Extratos não encontrados");
            } else {
                res.status(200).send({
                    resultado, pagina, registrosPorPagina
                })
            }

        } catch (e) {
            res.status(500).send({
                mensagem: "Erro, não foi possível buscar os extratos",
                erros
            });
        }
    }
}