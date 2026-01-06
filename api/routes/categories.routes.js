import { Router } from 'express';
import { categoriesController } from '../controllers/categories.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { categorySchema } from '../schemas/categories.schema.js';

const categoriesRoutes = Router();


categoriesRoutes.post('/', authMiddleware, validateSchema(categorySchema.create), categoriesController.createCategory);
categoriesRoutes.get('/', categoriesController.findAllCategories);
categoriesRoutes.get('/:id', validateSchema(categorySchema.findCategoryById), categoriesController.findCategoryById);
categoriesRoutes.delete('/:id', authMiddleware, validateSchema(categorySchema.delete),  categoriesController.deleteCategoryById);
categoriesRoutes.put('/:id', authMiddleware, validateSchema(categorySchema.update),  categoriesController.updateCategoryById);
export { categoriesRoutes };