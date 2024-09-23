import { DateTime } from "luxon";

export interface Endereco {
    end_cep: string;
    end_rua: string;
    end_num: string;
    end_bairro: string;
    end_cidade: string;
    end_uf: string [2];
    end_complemento: string;
    end_dtCriado: Date;
}