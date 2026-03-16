import { url } from 'zod';
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
        throw new appError("Erro ao criar imagem de produto", 500); 
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

deleteProdImagesByUrls: async (id, Urls) => {
    
     const patchImages = Urls.map(url => {
        const imagePath = url.split('/');
        return imagePath[imagePath.length - 1];
    });

    if (patchImages.length === 0) {
        return true; // Não há imagens para deletar, então retornamos true
     }
    
    const { error: storageError } = await supabase.storage.from('Marketplace-Images').remove(patchImages);

    if (storageError) {
        console.error("Erro ao deletar imagens do storage:", storageError);
        throw new appError("Erro ao deletar imagens do storage");
    }

    const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', id)
        .in('image_url', Urls);

    if (dbError) throw new appError("Erro ao limpar registros de imagem do banco de dados: " + dbError.message, 500);

    return true;
},

deleteProdImagesByProductId: async (productId) => {
    const { data: imagesToDelet, error: Error } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', productId);

    if (Error) {
        throw new appError("Erro ao buscar imagens do produto", 500);
    }

     const patchImages = imagesToDelet.map(image => {
        const imagePath = image.image_url.split('/');
        return imagePath[imagePath.length - 1];
    });

    if (patchImages.length === 0) {
        return true; // Não há imagens para deletar, então retornamos true
     }
    
    const { error: storageError } = await supabase.storage.from('Marketplace-Images').remove(patchImages);

    if (storageError) {
        console.error("Erro ao deletar imagens do storage:", storageError);
        throw new appError("Erro ao deletar imagens do storage: " + storageError.message, 500);
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