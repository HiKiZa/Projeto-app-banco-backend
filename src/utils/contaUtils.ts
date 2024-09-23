import { prismaClient } from "index";

export class contaUtils {

    static senhaValida(con_senha: string) {
        const digitos = String(con_senha).split('').map(Number)
        const tamSenha = 4;
        if (con_senha.length == tamSenha) {
            var flag = 0;
            var sequencial = 0;
            for (var i = 1; i < tamSenha; i++) {
                if (digitos[i] - 1 == digitos[i - 1] || digitos[i] == digitos[i-1]) {
                    flag++;
                    if (flag == 2) {
                        sequencial ++;
                    }
                }
                else
                    flag = 0;
            } 
            if (flag == 3){
                return false;
            } else {return true;}
        }
        
    }
}