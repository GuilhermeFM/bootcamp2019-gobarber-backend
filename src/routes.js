import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddlerware from './app/middlewares/auth';

const routers = new Router();
const upload = multer(multerConfig);

routers.post('/users', UserController.store);

routers.post('/session', SessionController.store);

routers.use(authMiddlerware);

routers.put('/users', UserController.update);

routers.get('/providers', ProviderController.index);
routers.get('/providers/:id/available', AvailableController.index);

routers.get('/appointments', AppointmentController.index);
routers.post('/appointments', AppointmentController.store);
routers.delete('/appointments/:id', AppointmentController.delete);

routers.get('/schedules', ScheduleController.index);

routers.get('/notifications', NotificationController.index);
routers.put('/notifications/:id', NotificationController.update);

routers.post('/files', upload.single('file'), FileController.store);

export default routers;
