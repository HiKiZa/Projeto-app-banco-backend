
export interface Transferencia {
    trans_remetente: number;
    trans_destinatario: number;
    trans_val: number;
    trans_dtTrans: Date|string;
    trans_descricao: string;
}