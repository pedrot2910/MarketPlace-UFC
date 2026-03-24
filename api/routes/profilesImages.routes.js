import { Router } from "express";
import { profilesImagesController } from "../controllers/profilesImages.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { profilesImagesSchema } from "../schemas/profilesImages.schema.js";
const profilesImagesRoutes = Router();

profilesImagesRoutes.post(
  '/:id/image',
  authMiddleware,
    validateSchema(profilesImagesSchema.create),
  profilesImagesController.createProfileImage,
);

profilesImagesRoutes.put(
  '/:id/image',
  authMiddleware,
    validateSchema(profilesImagesSchema.update),
  profilesImagesController.updateProfileImage,
);

profilesImagesRoutes.delete(
  '/:id/image',
  authMiddleware,

  profilesImagesController.deleteProfileImage,
);

profilesImagesRoutes.get('/:id/image', profilesImagesController.getProfileImage);



export { profilesImagesRoutes };