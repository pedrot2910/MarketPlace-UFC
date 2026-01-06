import supabase from '../supabase.js'; 

const productsImagesService = {

    createProdImages: async (product_id, image_url, is_cover) => { 
    
    const { data, error } = await supabase 
        .from('product_images') 
        .insert([ 
            {
                product_id: product_id, 
                image_url: image_url,
                is_cover: is_cover
            }
        ]) 
        .select(); 

    if (error) { 
        throw new Error(error.message); 
    }

    return data;  
},

getAllProdImages: async () => {
    const {data, error} = await supabase
        .from('product_images')
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
},

getProdImagesById: async (id) => {
    const {data, error} = await supabase
        .from('product_images')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
},

deleteProdImagesById: async (id) => {
    const {error} = await supabase
        .from('product_images')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
},

updateProdImagesById: async (id, updatedData) => {
    const {data, error} = await supabase
        .from('product_images')
        .update(updatedData)
        .eq('id', id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
},

};

export { productsImagesService };