import { PrismaClient } from "@prisma/client";
import { Admin } from "dtos/AdminDTO";
import * as bcrypt from 'bcrypt'

export const prisma = new PrismaClient();


export default class AdminModelo {

  criar = async (admin: Admin) => {
    usuario.adm_senha = bcrypt.hashSync(admin.adm_senha, 12)
    return await prisma.usuario.create({
      data: {
        adm_nome: admin.adm_nome,
        adm_senha: admin.adm_senha,
        adm_acesoo: admin.adm_acesso
      }
    })
  }



  buscarTodos = async () => {
    return await prisma.admin.findMany();
  }

  buscarUm = async (adm_id: number) => {
    return await prisma.admin.findUnique({
      where: {
        adm_id
      }
    })
  }

  excluir = async (adm_id: number) => {
    return await prisma.admin.delete({
      where: {
        adm_id
      }
    })
  }

  alterar = async (adm_id: number, admin: Admin) => {
    return await prisma.admin.update({
      where: {
        adm_id
      },
      data: {
        ...admin
      }
    })
  }

  alterarSenha = async (adm_id: number, senha_nova: string) => {
    const novaSenha = bcrypt.hashSync(senha_nova, 12)
    return await prisma.admin.update({
      where: {
        adm_id: adm_id
      }, data: {
        adm_senha: novaSenha
      }
    })
  }
}
