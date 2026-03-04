import { favoritesService } from "../services/favorites.service.js";

const favoritesController = {

    toggleFavorite: async (req, res, next) => {
        try {

            const Exists = await favoritesService.getByUserAndProduct(req.body, req.user.id);

            if (Exists) {
                await favoritesService.deleteByUserAndProduct(req.body, req.user.id);
                
                return res.status(200).json({ 
                    message: 'Produto removido dos favoritos.', 
                    action: 'removed'
                });

            } else {
                
                const [novoFavorito] = await favoritesService.createFavorite(req.body, req.user.id);
                
                return res.status(201).json({ 
                    message: 'Produto adicionado aos favoritos!', 
                    action: 'created', 
                    data: novoFavorito 
                });
            }

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