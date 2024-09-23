import { PrismaClient } from "@prisma/client"
import express from 'express';
import * as bodyParser from 'body-parser'


const prisma = new PrismaClient
const app = express()

export default class enderecoUtil {
  static async cepValido(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (!/^[\d]{8}$/.test(cepLimpo)) {
      return false
    }
    return true
  }
}
