import supabase from '../supabase.js'; 

const categoriesService = {

    createCategory: async (categoryData) => { 
    
    const { data, error } = await supabase 
        .from('categories') 
        .insert([categoryData]) 
        .select(); 

    if (error) { 
        throw new Error(error.message); 
    }

    return data;  
},

getAllCategories: async () => {
    const {data, error} = await supabase
        .from('categories')
        .select('*');

    if (error) {
        throw new Error(error.message);
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
        throw new Error(error.message);
    }

    return data;
},

deleteCategoryById: async (id) => {
    const {error} = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
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
        throw new Error(error.message);
    }

    return data;
},

};

export { categoriesService };