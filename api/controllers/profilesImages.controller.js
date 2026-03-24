import { profilesImagesService } from "../services/profilesImages.service.js";

const profilesImagesController = {

    createProfileImage: async (req, res, next) => {
    try {
      const image = await profilesImagesService.createProfileImage(
        req.user.id,
        req.body,
      );
      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  },

  updateProfileImage: async (req, res, next) => {
    try {
      const image = await profilesImagesService.updateProfileImage(
        req.user.id,
        req.body,
      );
      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  },

  deleteProfileImage: async (req, res, next) => {
    try {
      await profilesImagesService.deleteProfileImage(req.user.id);
      res.status(200).json({ message: "Imagem deletada com sucesso" });
    } catch (error) {
      next(error);
    }
  },

  getProfileImage: async (req, res, next) => {
    try {
      const image = await profilesImagesService.getProfileImage(req.params.id);

      if (!image) {
        return res.status(200).json({ imageUrl: null });
      }
      res.status(200).json({ imageUrl: image.image_url });
    } catch (error) {
      if (
        error.message &&
        (error.message.includes("JSON object requested") ||
          error.message.includes("Not found"))
      ) {
        return res.status(200).json({ imageUrl: null });
      }

      next(error);
    }
  },
};

export { profilesImagesController };