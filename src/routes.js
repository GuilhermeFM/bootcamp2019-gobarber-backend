import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routers = new Router();

routers.post('/users', UserController.store);
routers.post('/session', SessionController.store);

export default routers;
