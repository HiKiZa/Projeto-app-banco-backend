import { PrismaClient } from "@prisma/client";
import { Usuario } from "dtos/UsuarioDTO";
import { Endereco } from "dtos/EnderecoDTO";
import { Conta } from "dtos/ContaDTO";
import * as bcrypt from 'bcrypt'

export const prisma = new PrismaClient();


export default class UsuarioModelo {

  criar = async (usuario: Usuario) => {
    usuario.usu_senha = bcrypt.hashSync(usuario.usu_senha, 12)
    return await prisma.usuario.create({
      data: {
        usu_cpf: usuario.usu_cpf,
        usu_nome: usuario.usu_nome,
        usu_email: usuario.usu_email,
        usu_telefone: usuario.usu_telefone,
        usu_dtNasc: usuario.usu_dtNasc,
        usu_senha: usuario.usu_senha
      }
    })
  }



  buscarTodos = async () => {
    return await prisma.usuario.findMany();
  }

  buscarUm = async (usu_id: number) => {
    return await prisma.usuario.findUnique({
      where: {
        usu_id
      }
    })
  }


  buscarCpf = async (usu_cpf: string) => {
    return await prisma.usuario.findUnique({
      where: {
        usu_cpf
      }
    })
  }

  excluir = async (usu_id: number) => {
    return await prisma.usuario.delete({
      where: {
        usu_id
      }
    })
  }

  alterar = async (usu_id: number, usuario: Usuario) => {
    return await prisma.usuario.update({
      where: {
        usu_id
      },
      data: {
        ...usuario
      }
    })
  }

  alterarSenha = async (usu_id: number, senha_nova: string) => {
    const novaSenha = bcrypt.hashSync(senha_nova, 12)
    return await prisma.usuario.update({
      where: {
        usu_id: usu_id
      }, data: {
        usu_senha: novaSenha
      }
    })
  }
}
