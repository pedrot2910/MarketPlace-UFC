import { favoritesService } from "../services/favorites.service.js";

const favoritesController = {

    toggleFavorite: async (req, res) => {
        try {
            const { user_id, product_id } = req.body;

            const Exists = await favoritesService.getByUserAndProduct(user_id, product_id);

            if (Exists) {
                await favoritesService.deleteByUserAndProduct(user_id, product_id);
                
                return res.status(200).json({ 
                    message: 'Produto removido dos favoritos.', 
                    action: 'removed'
                });

            } else {
                
                const [novoFavorito] = await favoritesService.createFavorite({ user_id, product_id });
                
                return res.status(201).json({ 
                    message: 'Produto adicionado aos favoritos!', 
                    action: 'created', 
                    data: novoFavorito 
                });
            }

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getFavoritesByUser: async (req, res) => {
        try {
            const { userId } = req.params;

            const favorites = await favoritesService.getAllFavoritesByUserId(userId);
            res.status(200).json(favorites);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
};

export { favoritesController };