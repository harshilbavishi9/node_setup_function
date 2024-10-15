import express from 'express';
import userRoutes from './user';
import { uploads, uploads2 } from '../utils/multer';
import { uploadImages, uploadImage } from '../controllers/imageController';

const routes = express.Router();

routes.use('/user', userRoutes);

routes.post('/upload/image', uploads, uploadImage);
routes.post('/upload/images', uploads2, uploadImages);

export default routes;
