import { Router } from 'express';
import {authController} from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { authSchema } from '../schemas/auth.schema.js';

const authRoutes = Router();

authRoutes.post('/signup', validateSchema(authSchema.signUp), authController.signUp);
authRoutes.post('/signin', validateSchema(authSchema.signIn), authController.signIn);

export { authRoutes };
