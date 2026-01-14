import { Router } from 'express';
import { profilesController } from '../controllers/profiles.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { profilesSchema } from '../schemas/profiles.schema.js';

const profilesRoutes = Router();

profilesRoutes.get('/', profilesController.findAllProfiles);
profilesRoutes.get(
  '/:id',
  validateSchema(profilesSchema.getProfileById),
  profilesController.findProfileById,
);
profilesRoutes.get('/:id/image', profilesController.getProfileImage);
profilesRoutes.post(
  '/:id/image',
  authMiddleware,
  profilesController.createProfileImage,
);
profilesRoutes.put(
  '/:id/image',
  authMiddleware,
  profilesController.updateProfileImage,
);
profilesRoutes.delete(
  '/:id/image',
  authMiddleware,
  profilesController.deleteProfileImage,
);
profilesRoutes.delete(
  '/:id',
  authMiddleware,
  validateSchema(profilesSchema.delete),
  profilesController.deleteProfileById,
);
profilesRoutes.put(
  '/:id',
  authMiddleware,
  validateSchema(profilesSchema.update),
  profilesController.updateProfileById,
);

export { profilesRoutes };
