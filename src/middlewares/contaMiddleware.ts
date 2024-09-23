import { RequestHandler } from "express"
import { manipulaErros } from "helpers/Erros";
import { contaUtils } from "utils/contaUtils";

var erro = new manipulaErros();
export default class ContaMiddleware {
    static validaCriar: RequestHandler = async (req, res, next) => {
        try {
            erro = new manipulaErros
            if (contaUtils.senhaValida(req.body.con_senha)) {
                return next();
            } else {
                res.send("Senha inválida")
            }
        } catch (err) {
            res.send(400).json({
                erro
            })
        }
    }
}