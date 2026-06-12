import supabase from '../supabase.js'; 
import { appError } from '../utils/appError.utils.js';

const favoritesService = {

    
    createFavorite: async (body, user_id) => { 

        const { product_id } = body;

        const favoriteData = { user_id: user_id, product_id: product_id };
        
        const { data, error } = await supabase 
            .from('favorites') 
            .insert([favoriteData]) 
            .select(); 
    
        if (error) throw new appError(error.message); 
        return data;  
    },
    
    getByUserAndProduct: async (body, user_id) => {
        const { product_id } = body;
        
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user_id)
            .eq('product_id', product_id)
            .maybeSingle(); // .maybeSingle() é perfeito aqui: retorna null se não achar (sem dar erro)
    
        if (error) throw new appError(error.message);
        return data;
    },

    getAllFavoritesByUserId: async (user_id) => {
        const {data, error} = await supabase
            .from('favorites')
            // TRADUÇÃO DO SELECT: 
            // "Traga meus dados, e entre na tabela products para trazer titulo, preço e imagem"
            .select(`
                id,
                created_at,
                products (
                    id,
                    title,
                    price,
                    condition,
                    product_images ( image_url )
                )
            `)
            .eq('user_id', user_id);
    
        if (error) throw new appError(error.message);
        return data;
    },

    
    deleteByUserAndProduct: async (body, user_id) => {
        const { product_id } = body;
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user_id)
            .eq('product_id', product_id);

        if (error) throw new appError(error.message);
        return true;
    },

    toggleFavorite: async (body, user_id) => {
        const existingFavorite = await favoritesService.getByUserAndProduct(body, user_id);

        if (existingFavorite) {

            await favoritesService.deleteByUserAndProduct(body, user_id);

            return { 
                    message: 'Produto removido dos favoritos.', 
                    action: 'removed'
                };

        } else {
            const [newFavorite] = await favoritesService.createFavorite(body, user_id);

            return { 
                    message: 'Produto adicionado aos favoritos.', 
                    action: 'created',
                    data: newFavorite
                };

        }
    }
    
};

export { favoritesService };