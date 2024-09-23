import { RequestHandler } from "express"
import { usuarioUtils } from "utils/usuarioUtils"
import { StatusCodes } from 'http-status-codes';
import { manipulaErros } from "helpers/Erros";
import { Atributo, Tabela } from "dtos/ErrosDTO";
import { Erro } from '../dtos/ErrosDTO';


var erro = new manipulaErros();

export default class UsuarioMiddleware {
    static validaCriar: RequestHandler = async (req, res, next) => {
        try {
            if(!usuarioUtils.cpfValido(req.body.usu_cpf)){
                throw erro.adicionaErro(Tabela.Usuario, Atributo.Cpf, 400, "Cpf inválido");
            }
            if (!usuarioUtils.senhaValida(req.body.usu_senha)) {
                throw erro.adicionaErro(Tabela.Usuario, Atributo.Senha, 400, "Senha invalida");
            }
            if (!usuarioUtils.emailValido(req.body.usu_email)) {
                throw erro.adicionaErro(Tabela.Usuario, Atributo.Email, 400, "Email inválido");
            }
            if (!usuarioUtils.numeroValido(req.body.usu_telefone)) {
                throw erro.adicionaErro(Tabela.Usuario, Atributo.Telefone, 400, "Número de telefone inválido");           
            }
            next();
        } catch (e) {
            return res.status(400).json({ 
                erro
            })
        }
    }
}
