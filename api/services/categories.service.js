import supabase from '../supabase.js'; 
import {appError} from '../utils/appError.utils.js';

const categoriesService = {

    createCategory: async (body) => { 
    
     const {namecategories, icon} = body;

    const categoryData = {
        namecategories: namecategories,
        icon: icon
    };

    const { data, error } = await supabase 
        .from('categories') 
        .insert([categoryData]) 
        .select(); 

    if (error) { 
        throw new appError(error.message, 500); 
    }

    return data;  
},

getAllCategories: async () => {
    const {data, error} = await supabase
        .from('categories')
        .select('*');

    if (error) {
        throw new appError(error.message, 500);
    }

    return data;
},

getCategoryById: async (id) => {
    const {data, error} = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new appError(error.message, 500);
    }

    return data;
},

deleteCategoryById: async (id) => {
    const {error} = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        throw new appError(error.message, 500);
    }

    return true;
},

updateCategoryById: async (id, updatedData) => {
    const {data, error} = await supabase
        .from('categories')
        .update(updatedData)
        .eq('id', id)
        .select();

    if (error) {
        throw new appError(error.message, 500);
    }

    return data;
},

};

export { categoriesService };