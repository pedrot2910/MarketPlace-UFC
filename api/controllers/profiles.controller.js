import { profilesService } from "../services/profiles.service.js";
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
      const profile = await profilesService.getProfileById(req.params.id);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  deleteProfileById: async (req, res, next) => {
    try {
      await profilesService.deleteProfileById(req.user.id);
      res.status(200).json({ message: "Perfil deletado com sucesso!" });
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

};

  

export { profilesController };
