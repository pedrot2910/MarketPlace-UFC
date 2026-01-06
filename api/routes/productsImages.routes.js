import { Router } from 'express';
import { productsImagesController } from '../controllers/productsImages.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { productsImagesSchema } from '../schemas/productsImages.schema.js';

const productsImagesRoutes = Router();

productsImagesRoutes.post('/', authMiddleware, validateSchema(productsImagesSchema.create), productsImagesController.createProductImage);
productsImagesRoutes.get('/', productsImagesController.findAllProductsImages);
productsImagesRoutes.get('/:id', validateSchema(productsImagesSchema.findProductImageById), productsImagesController.findProductImageById);
productsImagesRoutes.delete('/:id', authMiddleware, validateSchema(productsImagesSchema.delete), productsImagesController.deleteProductImageById);
productsImagesRoutes.put('/:id', authMiddleware, validateSchema(productsImagesSchema.update), productsImagesController.updateProductImageById);
export { productsImagesRoutes };