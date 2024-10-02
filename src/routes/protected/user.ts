import express from 'express';
import { allUsers, getUser } from '../../controllers/userController';

const routes = express.Router();

routes.get('/all', allUsers);
routes.get('/one/:id', getUser);

export default routes;
