import supabase from '../supabase.js'; 

const favoritesService = {

    
    createFavorite: async (favoriteData) => { 
        const { data, error } = await supabase 
            .from('favorites') 
            .insert([favoriteData]) 
            .select(); 
    
        if (error) throw new Error(error.message); 
        return data;  
    },
    
    getByUserAndProduct: async (userId, productId) => {
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .maybeSingle(); // .maybeSingle() é perfeito aqui: retorna null se não achar (sem dar erro)
    
        if (error) throw new Error(error.message);
        return data;
    },

    getAllFavoritesByUserId: async (userId) => {
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
            .eq('user_id', userId);
    
        if (error) throw new Error(error.message);
        return data;
    },
    
    
    deleteFavoriteById: async (id) => {
        const {error} = await supabase
            .from('favorites')
            .delete()
            .eq('id', id);
    
        if (error) throw new Error(error.message);
        return true;
    },

    
    deleteByUserAndProduct: async (userId, productId) => {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw new Error(error.message);
        return true;
    }
    
};

export { favoritesService };