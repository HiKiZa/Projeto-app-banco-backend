import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prismaClient } from 'index';
import { JWT_SEGREDO } from 'secret';
import { StatusCodes } from 'http-status-codes';

export const login = async (req: Request, res: Response) => {
    const { usu_cpf, usu_senha } = req.body;
    usu_cpf.replace(/[a-zA-Z^'-.]/gm, "");
    let usuario = await prismaClient.usuario.findUnique({
      where: { usu_cpf }
    });
    if (!usuario || !compareSync(usu_senha, usuario.usu_senha)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        mensagem: "Cpf e/ou senha incorretos",
      })
    }
    const token = jwt.sign({
      usu_id: usuario.usu_id
    }, JWT_SEGREDO, {expiresIn: '8h'})
    const {usu_id} = usuario
    res.json({ usuario: usu_id, token })
  }