import { favoritesService } from "../services/favorites.service.js";

const favoritesController = {

    toggleFavorite: async (req, res, next) => {
        try {

            const result = await favoritesService.toggleFavorite(req.body, req.user.id);
            res.status(200).json(result);

        } catch (error) {
            next(error);
        }
    },

    getFavoritesByUser: async (req, res, next) => {
        try {

            const favorites = await favoritesService.getAllFavoritesByUserId(req.user.id);
            res.status(200).json(favorites);

        } catch (error) {
            next(error);
        }
    }
    
};

export { favoritesController };