import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routers = new Router();

routers.post('/users', UserController.store);

export default routers;
