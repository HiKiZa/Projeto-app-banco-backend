import { Usuario } from "dtos/UsuarioDTO";
import Joi from "joi";

export class usuarioUtils {

    static cpfValido(usu_cpf: string) {
        
        let regex = /[a-zA-Z]/g
        if (regex.test(usu_cpf)) {
            return false;
        } else {
            const str = usu_cpf;
            var resto = 0;
            var cpfNumero = []
            var cpf = str.replace(/[a-zA-Z^'-.]/gm, "");
            let aux = 0;
            var cpfDecomposto = cpf.split("", cpf.length)
            for (var i = 0; i < cpf.length; i++) {        
                cpfNumero.push(parseInt(cpfDecomposto[i]))
            }
            for (var i = 0; i <= cpf.length - 3; i++) {
                aux = (cpfNumero[i]) * (10 - i) + aux;
            }
            resto = aux % 11;
            resto = 11 - resto;
            if (resto >= 10) { resto = 0 }
            if (resto == cpfNumero[9]) {
                aux = 0;
                resto = 0;
                for (var i = 0; i <= cpf.length - 2; i++) {
                    aux = (cpfNumero[i]) * (11 - i) + aux;
                }
                resto = aux % 11;
                resto = 11 - resto;
                if (resto >= 10)
                    resto = 0;
                if (resto == cpfNumero[10]) { return true; }
                else { return false; }
            }
            else { return false }
        }
    }

    //^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.[a-z]{3})?[^.\W])$
    static emailValido(usu_email: string) {
        let regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
        if (regex.test(usu_email)) {
            return true;
        } else {
            return false;
        }
    }

    //^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$\g
    static senhaValida(usu_senha: string) {
        let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
        if (regex.test(usu_senha)) {
            return true;
        } else { return false; }
    }

    //^(([A-Z][a-z]+\s)+)$
    static nomeValido(usu_nome: string) {
        let regex = /^(([A-Z]{1}[a-z]+\s)+)$/g;
        if (regex.test(usu_nome)) {
            return true;
        } else { return false; }
    }

    static numeroValido(usu_numero: string) {
        const numeroLimpo = usu_numero.replace(/\D/g, '');
        if (numeroLimpo.length < 10) {
            return false;
        }
        return true;
    }

    static idadeValida(usu_dtNasc: string) {
        const dataAtual = new Date();
        const dtNasc = new Date(usu_dtNasc)
        const idade = dataAtual.getFullYear() - dtNasc.getFullYear();
        if (idade < 18) {
            return false;
        }
        return true;
    }
}