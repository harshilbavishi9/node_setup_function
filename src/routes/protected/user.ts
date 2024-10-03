import express from 'express';
import { updateUserValidation } from '../../middlewares/validators';
import { allUsers, deleteUser, getUser, updateUser } from '../../controllers/userController';

const routes = express.Router();

routes.get('/all', allUsers);
routes.get('/one/:id', getUser);
routes.delete('/delete/:id', deleteUser);
routes.patch('/update/:id', updateUserValidation, updateUser);

export default routes;
