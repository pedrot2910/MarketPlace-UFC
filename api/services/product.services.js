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

};

export { productService };