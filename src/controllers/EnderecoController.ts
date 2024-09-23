
import { Endereco } from "dtos/EnderecoDTO";
import { Atributo, Tabela } from "dtos/ErrosDTO";
import { Request, Response } from "express";
import { manipulaErros } from "helpers/Erros";
import ContaModelo from "models/ContaModelo";
import EnderecoModelo from "models/EnderecoModelo";
import enderecoUtil from "utils/enderecoUtils";


const contaModelo = new ContaModelo();
const enderecoModelo= new EnderecoModelo();
const erro = new manipulaErros();
export default class EnderecoController {

    criar = async (req: Request, res: Response) => {
        try {
            const usu_id = req.body.usu_id
            const ativo = await enderecoModelo.buscarUsu(usu_id)
            await enderecoModelo.alterarAtivo(usu_id)
            const endereco: Endereco = req.body;
            if(!enderecoUtil.cepValido(endereco.end_cep)){
                throw erro.adicionaErro(Tabela.Endereco, Atributo.Cep, 400, "Cep Inválido")
            }

            const novoEndereco: Endereco = await enderecoModelo.criar(endereco, usu_id);
            res.status(201).json(novoEndereco);
        } catch (e) {
            console.log("Não foi possível criar um endereço", e);
            res.status(500).send({
                error: "USR-01",
                message: "Não foi possível criar um endereço, " + e
            })
        }
    };

    buscar = async (req: Request, res: Response) => {
        try {
            const end_id: number = parseInt(req.params.id);
            const novoEndereco: Endereco | null = await enderecoModelo.buscarUm(end_id);

            if (novoEndereco) {
                res.status(200).json(novoEndereco);
            } else {
                res.status(404).json({
                    error: "USR-06 ",
                    message: "Endereço não encontrado"
                });
            }
        } catch (e) {
            console.log("Endereço não encontrado", e);
            res.status(500).send({
                error: "USR-02",
                message: "Endereço não encontrado"
            })
        }
    }

    buscarTodos = async (req: Request, res: Response) => {
        try {
            const usu_id = req.body.usu_id
            const endereco: Endereco[] | null = await enderecoModelo.buscarUsu(usu_id);
            res.status(200).json(endereco);
        } catch (e) {
            console.log("Não foi possível buscar todos os endereços", e);
            res.status(500).send({
                error: "USR-03",
                message: "Não foi possível buscar todos os endereços",
            });
        }
    }

    atualizar = async (req: Request, res: Response) => {
        try {
            const end_id: number = parseInt(req.params.id);
            await enderecoModelo.alterarAtivo(req.body.usu_id)
            const alterarEndereco: Endereco = req.body;
            const enderecoAlterado: Endereco | null = await enderecoModelo.alterar(
                end_id,
                alterarEndereco
            );
            if (enderecoAlterado) {
                res.status(200).json(enderecoAlterado);
            } else {
                res.status(404).json({
                    error: "USR-06",
                    message: "Endereço não encontrado.",
                  });
            }
        } catch (e) {
            console.log("Não foi possível alterar o endereço", e);
            res.status(500).send({
              error: "USR-04",
              message: "Não foi possível alterar o endereço",
            });
          }
        }

    excluir = async (req: Request, res: Response) => {
        try {
            const end_id: number = parseInt(req.params.id);
            const enderecoExcluido = await enderecoModelo.excluir(end_id);
            res.status(204).json(enderecoExcluido);
        } catch (e) {
            console.log("Não foi possível excluir o endereço", e);
            res.status(500).send({
              error: "USR-05",
              message: "Não foi possível excluir o endereço",
            });
        }
    };

    excluirTudo = async (req: Request, res: Response) => {
        try {
            const usu_id = req.body.usu_id
            const end_id: number = parseInt(req.params.id);
            const enderecoExcluido = await enderecoModelo.excluirTudo(usu_id);
            res.status(204).json(enderecoExcluido);
        } catch (e) {
            console.log("Não foi possível excluir o endereço", e);
            res.status(500).send({
              error: "USR-05",
              message: "Não foi possível excluir o endereço",
            });
        }
    }
}
