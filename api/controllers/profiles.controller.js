import { profilesService } from '../services/profiles.service.js';
const profilesController = {
  findAllProfiles: async (req, res) => {
    try {
      const profiles = await profilesService.getAllProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  findProfileById: async (req, res) => {
    try {
      const { id } = req.params;

      const profile = await profilesService.getProfileById(id);
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProfileById: async (req, res) => {
    try {
      const { id } = req.params;

      await profilesService.deleteProfileById(id);
      res.status(200).json({ message: 'Perfil deletado com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProfileById: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const [updatedProfile] = await profilesService.updateProfileById(
        id,
        updatedData,
      );

      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProfileImage: async (req, res) => {
    try {
      const { id } = req.params;

      const image = await profilesService.getProfileImage(id);
      res.status(200).json({ imageUrl: image.image_url });
    } catch (error) {
      res.status(404).json({ error: 'Imagem não encontrada' });
    }
  },

  createProfileImage: async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      const image = await profilesService.createProfileImage(id, imageUrl);
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProfileImage: async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      const image = await profilesService.updateProfileImage(id, imageUrl);
      res.status(200).json(image);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProfileImage: async (req, res) => {
    try {
      const { id } = req.params;

      await profilesService.deleteProfileImage(id);
      res.status(200).json({ message: 'Imagem deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export { profilesController };
