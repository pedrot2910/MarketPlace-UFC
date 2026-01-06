import { Router } from 'express'; 
import {productController} from '../controllers/product.controller.js'; 
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { productSchema } from '../schemas/product.schema.js';

const productRoutes = Router(); 

productRoutes.post('/', authMiddleware, validateSchema(productSchema.create), productController.createProduct);
productRoutes.get('/', productController.findAllProducts);
productRoutes.get('/:id', validateSchema(productSchema.getProductById), productController.findProductById);
productRoutes.delete('/:id', authMiddleware, validateSchema(productSchema.delete), productController.deleteProductById);
productRoutes.put('/:id', authMiddleware, validateSchema(productSchema.update), productController.updateProductById);
export { productRoutes }; 