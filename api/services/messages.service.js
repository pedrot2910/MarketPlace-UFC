import supabase from '../supabase.js'; 

const messagesService = {

    
    createMessage: async (messageData) => { 
        const { data, error } = await supabase 
            .from('messages') 
            .insert([messageData]) 
            .select(); 
    
        if (error) throw new Error(error.message); 
        return data;  
    },
    
    
    getMessagesByUser: async (userId) => {
        const { data, error } = await supabase
            .from('messages')
            .select(`
                id,
                message,
                created_at,
                is_read:read_at,
                sender:profiles!sender_id (id, name, email),
                receiver:profiles!receiver_id (id, name, email),
                product:products (id, title, product_images(image_url))
            `)
            // FILTRO OR: "Onde sender_id = EU ... OU ... receiver_id = EU"
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false }); // Mais recentes primeiro

        if (error) throw new Error(error.message);
        return data;
    },

    // 3. Ler uma mensagem específica (útil para detalhes)
    getMessageById: async (id) => {
        const {data, error} = await supabase
            .from('messages')
            .select('*')
            .eq('id', id)
            .single();
    
        if (error) throw new Error(error.message);
        return data;
    },
    
    
    deleteMessageById: async (id) => {
        const {error} = await supabase
            .from('messages')
            .delete()
            .eq('id', id);
    
        if (error) throw new Error(error.message);
        return true;
    }

    
};

export { messagesService };