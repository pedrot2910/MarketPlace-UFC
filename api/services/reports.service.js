import supabase from '../supabase.js'; 

export const reportsService = {

    createReport: async (reportData) => { 
        const { data, error } = await supabase 
            .from('reports') 
            .insert([reportData]) 
            .select(); 
    
        if (error) throw new Error(error.message); 
        return data;  
    },

    getAllReports: async () => {
        const { data, error } = await supabase
            .from('reports')
            .select(`
                *,
                reporter:profiles (name, email),          
                product:products (title, product_images(image_url)) 
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    },

    getReportById: async (id) => {
        const { data, error } = await supabase
            .from('reports')
            .select(`
                *,
                reporter:profiles (name, email),
                product:products (title, price, product_images(image_url))
            `)
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    deleteReportById: async (id) => {
        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
        return true;
    },

    updateReportStatus: async (id, newStatus) => {
        const { data, error } = await supabase
            .from('reports')
            .update({ status: newStatus }) 
            .eq('id', id)
            .select();

        if (error) throw new Error(error.message);
        return data;
    }
};