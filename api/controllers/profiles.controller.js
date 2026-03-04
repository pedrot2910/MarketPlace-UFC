import { profilesService } from '../services/profiles.service.js';
const profilesController = {
  findAllProfiles: async (req, res, next) => {
    try {
      const profiles = await profilesService.getAllProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      next(error);
    }
  },

  findProfileById: async (req, res, next) => {
    try {

      const profile = await profilesService.getProfileById(req.params);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  deleteProfileById: async (req, res, next) => {
    try {

      await profilesService.deleteProfileById(req.user.id);
      res.status(200).json({ message: 'Perfil deletado com sucesso!' });
    } catch (error) {
      next(error);
    }
  },

  updateProfileById: async (req, res, next) => {
    try {

      const [updatedProfile] = await profilesService.updateProfileById(
        req.user.id,
        req.body,
      );

      res.status(200).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  },

  getProfileImage: async (req, res, next) => {
    try {
      const image = await profilesService.getProfileImage(req.params);
      res.status(200).json({ imageUrl: image.image_url });
    } catch (error) {
      next(error);
    }
  },

  createProfileImage: async (req, res, next) => {
    try {
      const image = await profilesService.createProfileImage(req.user.id, req.body);
      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  },

  updateProfileImage: async (req, res, next) => {
    try {
      const image = await profilesService.updateProfileImage(req.user.id, req.body);
      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  },

  deleteProfileImage: async (req, res, next) => {
    try {
      await profilesService.deleteProfileImage(req.user.id);
      res.status(200).json({ message: 'Imagem deletada com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

export { profilesController };
