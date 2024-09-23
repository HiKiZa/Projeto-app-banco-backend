import jwt, { verify, JsonWebTokenError, Jwt } from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from "http-status-codes";
import { JWT_SEGREDO } from "secret";

import UsuarioModelo from "models/UsuarioModelo";
import { manipulaErros } from "helpers/Erros";
import { Atributo, Tabela } from "dtos/ErrosDTO";

type JwtPayload = {
    usu_id: number
}
var erro = new manipulaErros();

export const autorizado = async (req: Request, res: Response, next: NextFunction) => {
    try {
        erro = new manipulaErros
        const usuarioModelo = new UsuarioModelo()
        const { authorization } = req.headers
        if (!authorization) {
            throw erro.adicionaErro(Tabela.Usuario, Atributo.Token, 400, "Token inválido");
        }
        //@ts-ignore
        const token = authorization.split(' ')[1]
        const { usu_id } = jwt.verify(token, JWT_SEGREDO) as JwtPayload
        const usuario = await usuarioModelo.buscarUm(usu_id)
        if (!usuario) {
            throw erro.adicionaErro(Tabela.Usuario, Atributo.id, 400, "Usuário inválido");
        }
        req.body.usu_id = usu_id
        next();
    } catch (e) {
        return res.status(400).json({
            erro
        })
    }
}

export default autorizado;