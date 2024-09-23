import { Router } from 'express';
import TransferenciaController from 'controllers/TransferenciaController';
import autorizado from '../middlewares/auth';
import transferenciaUtils from '../utils/transferenciaUtils';
import TransferenciaMiddleware from 'middlewares/transferenciaMiddleware';

const routes = Router();
const transferenciaController = new TransferenciaController();
const transferenciaMiddleware = new TransferenciaMiddleware();
routes.use(autorizado)
routes.post('/criar',  transferenciaController.criar);
//routes.get('/',  transferenciaController.buscarTodos);
routes.get('/teste', transferenciaController.infoTrans);
routes.get('/extratos/:pagina', transferenciaController.buscarExtratos);
routes.get('/:id', transferenciaUtils.presenteTrans, transferenciaController.buscarDetalhes);
routes.put('/:id',  transferenciaController.atualizar);
routes.delete('/:id', transferenciaController.excluir);

export default routes;