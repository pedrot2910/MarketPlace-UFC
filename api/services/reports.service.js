import supabase from '../supabase.js'; 
import { appError } from '../utils/appError.utils.js';

const reportsService = {

    createReport: async (body, reporter_id) => { 

        const reportData = {
            ...body,
            reporter_id: reporter_id
        };

        const { data, error } = await supabase 
            .from('reports') 
            .insert([reportData]) 
            .select(); 
    
        if (error) throw new appError(error.message, 500);
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

        if (error) throw new appError(error.message, 500);
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

        if (error) throw new appError(error.message, 500);
        return data;
    },

    deleteReportById: async (id) => {
        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', id);

        if (error) throw new appError(error.message, 500);
        return true;
    },

    updateReportStatus: async (id, newStatus) => {
        const { data, error } = await supabase
            .from('reports')
            .update({ status: newStatus }) 
            .eq('id', id)
            .select();

        if (error) throw new appError(error.message, 500);
        return data;
    }
};

export { reportsService };