import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddlerware from './app/middlewares/auth';

const routers = new Router();

routers.post('/users', UserController.store);
routers.post('/session', SessionController.store);

routers.use(authMiddlerware);

routers.put('/users', UserController.update);

export default routers;
