import { Tabela, Atributo, HTTP_Codes, Erro } from '../dtos/ErrosDTO';


export class manipulaErros{

	private Erros: Erro[]

	constructor() {
		this.Erros = []
	}

	adicionaErro(tabela: Tabela, atributo: Atributo, codigo: HTTP_Codes, mensagem: string){
		this.Erros.push({tabela, atributo, codigo, mensagem});
	}

	getErros(){
		return this.Erros
	}

   concatenaErro(ERROS: manipulaErros){
		this.Erros = this.Erros.concat(ERROS.getErros());
	} 
}