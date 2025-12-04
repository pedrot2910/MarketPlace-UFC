import { Router } from 'express'; 
import {productController} from '../controllers/product.controller.js'; 

const productRoutes = Router(); 

productRoutes.post('/', productController.createProduct);
productRoutes.get('/', productController.findAllProducts);
productRoutes.get('/:id', productController.findProductById);

export { productRoutes }; 