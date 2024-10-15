import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import { loginUserValidation, registerUserValidation } from '../middlewares/validators';

const routes = express.Router();

routes.post('/login', loginUserValidation, loginUser);
routes.post('/register', registerUserValidation, registerUser);

export default routes;
