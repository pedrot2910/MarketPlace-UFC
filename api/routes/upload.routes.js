import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller.js';

import { uploadMiddleware } from '../middlewares/upload.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const uploadRoutes = Router();

uploadRoutes.post('/', authMiddleware, uploadMiddleware.single('file'), uploadController.uploadImage);

export { uploadRoutes };