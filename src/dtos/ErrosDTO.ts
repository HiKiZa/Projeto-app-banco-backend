
export enum HTTP_Codes {
    BadRequest = 400,
    Unauthorized = 401,
    ServerError = 500,
    Ok = 200,
    NotFound = 404

}

export enum Tabela {
    Usuario = "Usuario",
    Endereco = "Endereco",
    Conta = "Conta",
    Transferencia = "Transferencia",
    Agencia = "Agencia"
}

export enum Atributo {
    id = "id",
    Nome = "nome",
    Cpf = "cpf",
    Email = "email",
    Senha = "senha",
    Telefone = "numero de telefone",
    Cep = "cep",
    Rua = "rua",
    Numero = "numero",
    Complemento = "complemento",
    Bairro = "bairro",
    Cidade = "cidade",
    Estado = "estado",
    Status = "status",
    Saldo = "saldo",
    SenhaTrans = "senha transacional",
    Token = "token",
    dtNasc = "idade",
    Geral = "geral"
    
}

export interface Erro {
    atributo: Atributo;
    tabela: Tabela;
    codigo: HTTP_Codes;
    mensagem: string;
}