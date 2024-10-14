import { Admin } from "dtos/AdminDTO";
import { NextFunction, Request, Response } from "express";
import AdminModelo from "models/AdminModdelo";
import * as jwt from 'jsonwebtoken';
import { JWT_SEGREDO } from "secret";
import { compareSync } from "bcrypt";
import { manipulaErros } from "helpers/Erros";
import { Atributo, Tabela, HTTP_Codes } from "dtos/ErrosDTO";

const erros = new manipulaErros();
type JwtPayload = {
    adm_id: number,
    adm_acessso: number
}

export default class AdminController {
  criar = async (req: Request, res: Response) => {
        try {
            const admin: Admin = req.body;
            const novoAdmin: Admin = await adminModelo.criar(admin);
            res.status(201).json(novoAdmin);
        } catch (e) {
            console.log("Não foi possível criar uma conta administradora", e);
            res.status(500).send({
                error: "USR-01",
                message: "Não foi possível criar uma conta de administrador"
            })
        }
    };
  buscarUm = async (req: Request, res: Response) => {
        try {
            const adm_id = parseInt(req.params.id);
            const novoAdmin: Admin | null = await adminModelo.buscarUm(adm_id);
            if (novoAdmin) {
                res.status(200).json(novoAdmin);
            } else {
                res.status(404).json({
                    error: "USR-06 ",
                    message: "Admin não encontrado"
                });
            }
        } catch (e) {
            console.log("Admin não encontrado", e);
            res.status(500).send({
                error: "USR-02",
                message: "Admin não encontrado"
            })
        }
    };
     atualizar = async (req: Request, res: Response) => {
        try {
            const adm_id: number = req.body.adm_id;
            const admin = await adminModelo.buscarUm(adm_id);
            const alteraAdm: Admin = req.body;
            if (admin) {
                alteraAdm.adm_nome = admin.adm_nome;
            }

            const admAlterado: Admin | null = await adminModelo.alterar(
                adm_id,
                alteraAdm
            );
            if (admAlterado) {
                res.status(200).json(admAlterado);
            } else {
                res.status(404).json({
                    error: "USR-06",
                    message: "Admin não encontrado.",
                });
            }
        } catch (e) {
            console.log("Não foi possível alterar o admin", e);
            res.status(500).send({
                error: "USR-04",
                message: "Não foi possível alterar o admin",
            });
        }
    }

}
