import { Router } from 'express';
import EnderecoController from 'controllers/EnderecoController';
import autorizado from 'middlewares/auth';

const routes = Router();
const enderecoController = new EnderecoController();

routes.post('/criar', autorizado, enderecoController.criar);
routes.get('/', autorizado, enderecoController.buscarTodos);
routes.get('/eu', autorizado, enderecoController.buscar);
routes.delete('/tudo', autorizado, enderecoController.excluirTudo);
routes.put('/:id', autorizado, enderecoController.atualizar);
routes.delete('/:id', autorizado, enderecoController.excluir);

export default routes;