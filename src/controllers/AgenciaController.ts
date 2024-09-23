
import { Agencia } from "dtos/AgenciaDTO";
import { Request, Response } from "express";
import AgenciaModelo from "models/AgenciaModelo";




const agenciaModelo= new AgenciaModelo();

export default class AgenciaController {

    criar = async (req: Request, res: Response) => {
        try {
            const agencia: Agencia = req.body;
            const novaAgencia: Agencia = await agenciaModelo.criar(agencia);
            res.status(201).json(novaAgencia);
        } catch (e) {
            console.log("Não foi possível criar uma agencia", e);
            res.status(500).send({
                error: "USR-01",
                message: "Não foi possível criar uma agencia"
            })
        }
    };

    buscar = async (req: Request, res: Response) => {
        try {
            const age_nome: string = req.params.age_nome;
            const novaAgencia: Agencia | null = await agenciaModelo.buscarUm(age_nome);

            if (novaAgencia) {
                res.status(200).json(novaAgencia);
            } else {
                res.status(404).json({
                    error: "USR-06 ",
                    message: "Agencia não encontrada"
                });
            }
        } catch (e) {
            console.log("Agencia não encontrada", e);
            res.status(500).send({
                error: "USR-02",
                message: "Agencia não encontrada"
            })
        }
    }

    buscarTodos = async (req: Request, res: Response) => {
        try {
            const agencia: Agencia[] | null = await agenciaModelo.buscarTodos();
            res.status(200).json(agencia);
        } catch (e) {
            console.log("Não foi possível buscar todas as agencias", e);
            res.status(500).send({
                error: "USR-03",
                message: "Não foi possível buscar todas as agencias",
            });
        }
    }

    atualizar = async (req: Request, res: Response) => {
        try {
            const age_nome: string = req.params.age_nome;
            const alterarAgencia: Agencia = req.body;
            const agenciaAlterada: Agencia | null = await agenciaModelo.alterar(
                age_nome,
                alterarAgencia
            );
            if (agenciaAlterada) {
                res.status(200).json(agenciaAlterada);
            } else {
                res.status(404).json({
                    error: "USR-06",
                    message: "Agencia não encontrada.",
                  });
            }
        } catch (e) {
            console.log("Não foi possível alterar a agencia", e);
            res.status(500).send({
              error: "USR-04",
              message: "Não foi possível alterar a agencia",
            });
          }
        }

    excluir = async (req: Request, res: Response) => {
        try {
            const age_nome: string = req.params.age_nome;
            const agenciaExcluida = await agenciaModelo.excluir(age_nome);
            res.status(204).json(agenciaExcluida);
        } catch (e) {
            console.log("Não foi possível excluir a agencia", e);
            res.status(500).send({
              error: "USR-05",
              message: "Não foi possível excluir a agencia",
            });
        }
    };
}

