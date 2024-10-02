import express from 'express';
import authRoutes from './auth/auth';
import userRoutes from './protected/user';
import { verifyToken } from '../utils/token';
import { uploadImages, uploadImage } from '../controllers/imageController';
import { uploads, uploads2 } from '../utils/multer';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/user', verifyToken, userRoutes);

routes.post('/upload/image', uploads, uploadImage);
routes.post('/upload/images', uploads2, uploadImages);

export default routes;
