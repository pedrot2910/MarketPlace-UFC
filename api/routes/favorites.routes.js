import { Router } from 'express';
import { favoritesController } from '../controllers/favorites.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { favoritesSchema } from '../schemas/favorites.schema.js';

const favoritesRoutes = Router();


favoritesRoutes.post('/toggle', authMiddleware, validateSchema(favoritesSchema.toggle),  favoritesController.toggleFavorite);

favoritesRoutes.get('/user/:userId', authMiddleware, validateSchema(favoritesSchema.getFavoritesByUser),  favoritesController.getFavoritesByUser);

export { favoritesRoutes };