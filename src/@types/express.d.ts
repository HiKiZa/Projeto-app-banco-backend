import { Usuario } from 'dtos/UsuarioDTO';

declare global {
    namespace Express {
        export interface Request {
            usuario: Usuario
        }
    }
}