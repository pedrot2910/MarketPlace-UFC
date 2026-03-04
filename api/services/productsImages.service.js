import supabase from '../supabase.js'; 
import { appError } from '../utils/appError.utils.js';

const productsImagesService = {

    createProdImages: async (body) => { 
    const { product_id, image_url, is_cover } = body;

    const productImageData = {
        product_id: product_id,
        image_url: image_url,
        is_cover: is_cover
    };

    const { data, error } = await supabase 
        .from('product_images') 
        .insert([ 
            productImageData
        ]) 
        .select(); 

    if (error) { 
        throw new appError(error.message, 500); 
    }

    return data;  
},

getAllProdImages: async () => {
    const {data, error} = await supabase
        .from('product_images')
        .select('*');

    if (error) {
        throw new appError(error.message, 500);
    }

    return data;
},

getProdImagesById: async (params) => {

    const { id } = params;

    const {data, error} = await supabase
        .from('product_images')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new appError(error.message, 500);
    }

    return data;
},

deleteProdImagesById: async (params) => {
    const { id } = params;
    const {error} = await supabase
        .from('product_images')
        .delete()
        .eq('id', id);

    if (error) {
        throw new appError(error.message, 500);
    }

    return true;
},

updateProdImagesById: async (params, updatedData) => {
    const { id } = params;
    const {data, error} = await supabase
        .from('product_images')
        .update(updatedData)
        .eq('id', id)
        .select();

    if (error) {
        throw new appError(error.message, 500);
    }

    return data;
},

};

export { productsImagesService };