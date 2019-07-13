import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddlerware from './app/middlewares/auth';

const routers = new Router();
const upload = multer(multerConfig);

routers.post('/users', UserController.store);
routers.post('/session', SessionController.store);

routers.use(authMiddlerware);

routers.put('/users', UserController.update);
routers.get('/providers', ProviderController.store);
routers.post('/files', upload.single('file'), FileController.store);

export default routers;
