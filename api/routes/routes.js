import {productRoutes} from './product.routes.js';
import { Router } from 'express';

const router = Router();

router.use('/products', productRoutes);

export default router;

