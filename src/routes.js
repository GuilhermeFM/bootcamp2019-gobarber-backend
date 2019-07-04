import { Router } from 'express';

const routers = new Router();

routers.get('/', (req, res) => res.json({ message: 'Hello World' }));

export default routers;
