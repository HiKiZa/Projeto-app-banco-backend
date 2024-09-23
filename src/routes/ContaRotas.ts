import { Router } from 'express';
import ContaController from 'controllers/ContaController';
import ContaMiddleware from 'middlewares/contaMiddleware';
import  autenticado, { autorizado } from 'middlewares/auth';
import TransferenciaController from 'controllers/TransferenciaController';
import TransferenciaMiddleware from 'middlewares/transferenciaMiddleware';
import transferenciaUtils from 'utils/transferenciaUtils';

const routes = Router();
const contaController = new ContaController();
const transferenciaController = new TransferenciaController
routes.use(autorizado)
routes.post('/criar', /* ContaMiddleware.validaCriar */ contaController.criar);
routes.get('/', contaController.buscarTodos);
routes.get('/saldo', contaController.getSaldo);
routes.get('/eu',  contaController.getPerfil);
routes.put('/mudarSenha',  contaController.mudarSenha);
routes.post('/transferir',TransferenciaMiddleware.validaTransferir, transferenciaController.transferir);
routes.put('/',  contaController.atualizar);
routes.get('/:id',  contaController.buscar);
routes.delete('/:id',  contaController.excluir);

export default routes;