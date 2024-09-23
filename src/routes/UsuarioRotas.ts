import { Router } from 'express';
import UsuarioController from 'controllers/UsuarioController';
import usuarioMiddleware from 'middlewares/usuarioMiddeware';
import  autorizado from 'middlewares/auth';





const routes = Router();
const usuarioController = new UsuarioController();


routes.post('/criar', usuarioMiddleware.validaCriar, usuarioController.criar);
routes.get('/', usuarioController.buscarTodos);
routes.get('/eu', autorizado, usuarioController.getPerfil)
routes.delete('/apagar', autorizado, usuarioController.excluir);
routes.put('/alterarSenha', autorizado, usuarioController.mudarSenha);
routes.put('/editar', autorizado, usuarioController.atualizar);
export default routes;

