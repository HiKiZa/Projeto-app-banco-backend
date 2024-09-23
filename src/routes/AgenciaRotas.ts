import { Router } from 'express';
import AgenciaController from 'controllers/AgenciaController';

const routes = Router();
const agenciaController = new AgenciaController();

routes.post('/criar', agenciaController.criar);
routes.get('/', agenciaController.buscarTodos);
routes.get('/:id', agenciaController.buscar);
routes.put('/:id', agenciaController.atualizar);
routes.delete('/:id', agenciaController.excluir);

export default routes;