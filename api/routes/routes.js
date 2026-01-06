import {productRoutes} from './product.routes.js';
import { categoriesRoutes } from './categories.routes.js';
import { messagesRoutes } from './messages.routes.js';
import { profilesRoutes } from './profiles.routes.js';
import { productsImagesRoutes } from './productsImages.routes.js';
import { reportsRoutes } from './reports.routes.js';
import { favoritesRoutes } from './favorites.routes.js';
import { uploadRoutes } from './upload.routes.js';
import { authRoutes } from './auth.routes.js';

import { Router } from 'express';

const router = Router();

router.use('/products', productRoutes);
router.use('/categories', categoriesRoutes);
router.use('/messages', messagesRoutes);
router.use('/profile',profilesRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/products-images', productsImagesRoutes);
router.use('/reports', reportsRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);

export default router;

