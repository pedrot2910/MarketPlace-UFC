import supabase from '../supabase.js'; 

const productService = {

createProduct: async (productData) => { 
    
    const { data, error } = await supabase 
        .from('products') 
        .insert([productData]) 
        .select(); 

    if (error) { 
        throw new Error(error.message); 
    }

    return data;  
},

getAllProducts: async () => {
    const {data, error} = await supabase
        .from('products')
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
},

getProductById: async (id) => {
    const {data, error} = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
},

deleteProductById: async (id) => {
    const {error} = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
},

updateProductById: async (id, updatedData) => {
    const {data, error} = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
},

};

export { productService };