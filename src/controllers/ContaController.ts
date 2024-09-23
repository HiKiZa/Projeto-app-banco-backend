
import { NextFunction, Request, Response } from "express";
import ContaModelo from "models/ContaModelo";
import { Conta } from '../dtos/ContaDTO';
import { JwtPayload } from "jsonwebtoken";
import * as jwt from 'jsonwebtoken';
import { JWT_SEGREDO } from "secret";
import { contaUtils } from "utils/contaUtils";
import { manipulaErros } from "helpers/Erros";
import { Atributo, Tabela } from "dtos/ErrosDTO";



const contaModelo= new ContaModelo();
const erros = new manipulaErros();

export default class ContaController {

    criar = async (req: Request, res: Response) => {
        try {
            const conta: Conta = req.body;
            const novaConta: Conta = await contaModelo.criar(conta);
            res.status(201).json(novaConta);
        } catch (e) {
            console.log("Não foi possível criar uma conta", e);
            res.status(500).send({
                error: "USR-01",
                message: "Não foi possível criar uma conta"
            })
        }
    };

    buscar = async (req: Request, res: Response) => {
        try {
            const con_id: number = parseInt(req.params.id);
            const novaConta: Conta | null = await contaModelo.buscarUm(con_id);

            if (novaConta) {
                res.status(200).json(novaConta);
            } else {
                res.status(404).json({
                    error: "USR-06 ",
                    message: "Conta não encontrada"
                });
            }
        } catch (e) {
            console.log("Conta não encontrada", e);
            res.status(500).send({
                error: "USR-02",
                message: "Conta não encontrada"
            })
        }
    }

    buscarUsuario = async (req: Request, res: Response) => {
        try {
            const usu_id: number = parseInt(req.params.id);
            const novaConta: Conta | null = await contaModelo.buscarPorUsuario(usu_id);

            if (novaConta) {
                res.status(200).json(novaConta);
            } else {
                res.status(404).json({
                    error: "USR-06 ",
                    message: "Conta não encontrada"
                });
            }
        } catch (e) {
            console.log("Conta não encontrada", e);
            res.status(500).send({
                error: "USR-02",
                message: "Conta não encontrada"
            })
        }
    }

    buscarTodos = async (req: Request, res: Response) => {
        try {
            const conta: Conta[] | null = await contaModelo.buscarTodos();
            res.status(200).json(conta);
        } catch (e) {
            console.log("Não foi possível buscar todas as contas", e);
            res.status(500).send({
                error: "USR-03",
                message: "Não foi possível buscar todas as contas",
            });
        }
    }

    atualizar = async (req: Request, res: Response) => {
        try {
            const usu_id: number = req.body.usu_id
            const conta = await contaModelo.buscarPorUsuario(usu_id)
            const alterarConta: Conta = req.body;
            if(!conta){
                res.status(404).send({
                    mensagem: "conta não encontrada"
                })
            }
            const contaAlerada: Conta | null = await contaModelo.alterar(
               //@ts-ignore 
                conta.con_id,
                alterarConta
            );
            if (contaAlerada) {
                res.status(200).json(contaAlerada);
            } else {
                res.status(404).json({
                    error: "USR-06",
                    message: "Conta não encontrada.",
                  });
            }
        } catch (e) {
            console.log("Não foi possível alterar a conta", e);
            res.status(500).send({
              error: "USR-04",
              message: "Não foi possível alterar a conta",
            });
          }
        }

    excluir = async (req: Request, res: Response) => {
        try {
            const con_id: number = parseInt(req.params.con_id);
            const contaExcluida = await contaModelo.excluir(con_id);
            res.status(204).json(contaExcluida);
        } catch (e) {
            console.log("Não foi possível excluir a conta", e);
            res.status(500).send({
              error: "USR-05",
              message: "Não foi possível excluir a conta",
            });
        }
    };

    async getPerfil(req: Request, res: Response, next: NextFunction) {
        const usu_id = req.body.usu_id
        const conta = await contaModelo.buscarPorUsuario(usu_id)
        return res.json(conta)
    }
    
    async getSaldo(req: Request, res: Response, next: NextFunction) {
        const usu_id = req.body.usu_id
        const conta = await contaModelo.buscarPorUsuario(usu_id)
        return res.json({con_saldo: conta?.con_saldo})
    }

    mudarSenha = async (req: Request, res: Response) => {
        try {
            const conta = await contaModelo.buscarPorUsuario(req.body.usu_id)
            if (!contaUtils.senhaValida(req.body.senha_nova)) {
                throw erros.adicionaErro(Tabela.Conta, Atributo.SenhaTrans, 400, "Senha inválida")
            }
            if(!conta){
                throw erros.adicionaErro(Tabela.Conta, Atributo.id, 404, "Conta não encontrada")
            }
            if(conta.con_senha === req.body.senha_nova) {
                throw erros.adicionaErro(Tabela.Conta, Atributo.SenhaTrans, 400, "Senha nova não pode ser igual a antiga")
            }
            //@ts-ignore
            const contaAlterada = await contaModelo.alterarSenha(conta.con_id, req.body.senha_nova)
            if (!contaAlterada) {
                throw erros.adicionaErro(Tabela.Conta, Atributo.SenhaTrans, 500, "Senha não alterada")
            } else {
                res.status(500).send({
                    mensagem: "Deu certo"
                })
            }
        } catch (e) {
            console.log(erros)
            const erro = erros.getErros()
            res.status(400).send({
                erro
            })
        }
    }
}
