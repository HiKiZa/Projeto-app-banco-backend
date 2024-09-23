import { Usuario } from "dtos/UsuarioDTO";
import { NextFunction, Request, Response } from "express";
import UsuarioModelo from "models/UsuarioModelo";
import * as jwt from 'jsonwebtoken';
import { JWT_SEGREDO } from "secret";
import { compareSync } from "bcrypt";
import { usuarioUtils } from "utils/usuarioUtils";
import { manipulaErros } from "helpers/Erros";
import { Atributo, Tabela, HTTP_Codes } from "dtos/ErrosDTO";
import EnderecoModelo from "models/EnderecoModelo";
import AgenciaModelo from "models/AgenciaModelo";
import ContaModelo from "models/ContaModelo";


const enderecoModelo = new EnderecoModelo();
const usuarioModelo = new UsuarioModelo();
const erros = new manipulaErros();
const agenciaModelo = new AgenciaModelo();
const contaModelo = new ContaModelo();
type JwtPayload = {
    usu_id: number
}

export default class UsuarioController {

    criar = async (req: Request, res: Response) => {
        try {
            const usuario: Usuario = req.body;
            usuario.usu_cpf.replace(/[a-zA-Z^'-.]/gm, "");
            const novoUsuario: Usuario = await usuarioModelo.criar(usuario);
            res.status(201).json(novoUsuario);
        } catch (e) {
            console.log("Não foi possível criar um usuário", e);
            res.status(500).send({
                error: "USR-01",
                message: "Não foi possível criar um usuário"
            })
        }
    };

    buscarUm = async (req: Request, res: Response) => {
        try {
            const usu_id = parseInt(req.params.id);
            const novoUsuario: Usuario | null = await usuarioModelo.buscarUm(usu_id);
            if (novoUsuario) {
                res.status(200).json(novoUsuario);
            } else {
                res.status(404).json({
                    error: "USR-06 ",
                    message: "Usuário não encontrado"
                });
            }
        } catch (e) {
            console.log("Usuário não encontrado", e);
            res.status(500).send({
                error: "USR-02",
                message: "Usuário não encontrado"
            })
        }
    }

    buscarTodos = async (req: Request, res: Response) => {
        try {
            const usuario: Usuario[] | null = await usuarioModelo.buscarTodos();
            res.status(200).json(usuario);
        } catch (e) {
            console.log("Não foi possível buscar todos os usuários", e);
            res.status(500).send({
                error: "USR-03",
                message: "Não foi possível buscar todos os usuários",
            });
        }
    }

    atualizar = async (req: Request, res: Response) => {
        try {
            const usu_id: number = req.body.usu_id;
            const usuario = await usuarioModelo.buscarUm(usu_id);
            const alteraUsu: Usuario = req.body;
            if (usuario) {
                alteraUsu.usu_cpf = usuario.usu_cpf;
                alteraUsu.usu_dtNasc = usuario.usu_dtNasc;
            }

            const usuarioAlterado: Usuario | null = await usuarioModelo.alterar(
                usu_id,
                alteraUsu
            );
            if (usuarioAlterado) {
                res.status(200).json(usuarioAlterado);
            } else {
                res.status(404).json({
                    error: "USR-06",
                    message: "Usuario não encontrado.",
                });
            }
        } catch (e) {
            console.log("Não foi possível alterar o usuário", e);
            res.status(500).send({
                error: "USR-04",
                message: "Não foi possível alterar o usuário",
            });
        }
    }

    excluir = async (req: Request, res: Response) => {
        try {
            const usu_id = req.body.usu_id
            const usuarioExcluido = await usuarioModelo.excluir(usu_id);
            if (usuarioExcluido) {
                res.status(204).json(usuarioExcluido);
            }
        } catch (e) {
            console.log("Não foi possível excluir o usuário", e);
            res.status(500).send({
                error: "USR-05",
                message: "Não foi possível excluir o usuário",
            });
        }
    };


    buscarId = async (req: Request, res: Response) => {
        try {
            const usu_id = req.usuario.usu_id
            const novoUsuario: Usuario | null = await usuarioModelo.buscarUm(usu_id);
            if (novoUsuario) {
                res.status(200).json(novoUsuario);
            } else {
                res.status(404).json({
                    error: "USR-06 ",
                    message: "Usuário não encontrado"
                });
            }
        } catch (e) {
            console.log("Usuário não encontrado", e);
            res.status(500).send({
                error: "USR-02",
                message: "Usuário não encontrado"
            })
        }
    }

    async getPerfil(req: Request, res: Response) {
        const usu_id = req.body.usu_id;
        const endereco = await enderecoModelo.buscarUsu(usu_id);
        const conta = await contaModelo.buscarPorUsuario(usu_id)
        //@ts-ignore
        const agencia = await agenciaModelo.buscarUm(conta.age_nome);
        const usuario = await usuarioModelo.buscarUm(usu_id);
        const nome = usuario?.usu_nome;
        const email = usuario?.usu_email;
        const telefone = usuario?.usu_telefone;
        const nascimento = usuario?.usu_dtNasc;

        return res.json({ nome, email, telefone, nascimento, endereco, agencia })
    }

    mudarSenha = async (req: Request, res: Response) => {
        try {
            const usuario = await usuarioModelo.buscarUm(req.body.usu_id)
            if (!usuarioUtils.senhaValida(req.body.senha_nova)) {
                throw erros.adicionaErro(Tabela.Usuario, Atributo.Senha, 400, "Senha inválida")
            }
            //@ts-ignore
            if (!compareSync(req.body.senha_antiga, usuario.usu_senha)) {
                throw erros.adicionaErro(Tabela.Usuario, Atributo.Senha, 400, "Senha antiga incorreta")
            }
            //@ts-ignore
            const usuarioAlterado = await usuarioModelo.alterarSenha(req.body.usu_id, req.body.senha_nova)
            if (!usuarioAlterado) {
                throw erros.adicionaErro(Tabela.Usuario, Atributo.Senha, 500, "Senha não alterada")
            } else {
                res.status(204).send({
                    mensagem: "Deu certo"
                })
            }
        } catch (e) {
            const erro = erros.getErros()
            res.status(400).send({
                erro
            })
        }
    }

    esqueciSenha = async (req: Request, res: Response) => {
        try {
            const usuario = await usuarioModelo.buscarCpf(req.body.usu_cpf)
            if (!usuario) {
                throw erros.adicionaErro(Tabela.Usuario, Atributo.Senha, 404, "Usuario não encontrado")
            }
            if(usuario.usu_email != req.body.usu_email){
                throw erros.adicionaErro(Tabela.Usuario, Atributo.Senha, 400, "Email incorreto")
            }
            if(usuario.usu_dtNasc != req.body.usu_dtNasc){
                throw erros.adicionaErro(Tabela.Usuario, Atributo.dtNasc, 400, "Data de nascimento incorreta")
            }
            if (!usuarioUtils.senhaValida(req.body.senha_nova)) {
                throw erros.adicionaErro(Tabela.Usuario, Atributo.Senha, 400, "Senha inválida")
            }
            const usuarioAlterado = await usuarioModelo.alterarSenha(usuario.usu_id, req.body.senha_nova)
            console.log(usuarioAlterado)
            if (usuarioAlterado) {
                res.status(200).send({
                    mensagem: "Senha alterada com sucesso"
                })
            } else {
                throw erros.adicionaErro(Tabela.Usuario, Atributo.Senha, 500, "Senha não alterada")
            }
        } catch (e) {
            const erro = erros.getErros()
            console.log(erros)
            res.status(400).send({
                erro
            })
        }

    }
}
