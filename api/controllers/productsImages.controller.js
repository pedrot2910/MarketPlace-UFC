import { productsImagesService } from "../services/productsImages.service.js";

const productsImagesController = {

    createProductImage: async (req, res, next) => { 
    try { 

        const [newProductImage] = await productsImagesService.createProdImages( 
            req.body
        );

        // Success
        res.status(201).json(newProductImage); 

    } catch (error) { 
        // Internal Error
        next(error);
    }
},

findAllProductsImages: async (req, res, next) => {
    try {
        const productsImages = await productsImagesService.getAllProdImages();
        res.status(200).json(productsImages);
    } catch (error) {
        next(error);
    }

},

findProductImageById: async (req, res, next) => {
    try {
        
        const productImage = await productsImagesService.getProdImagesById(req.params);
        res.status(200).json(productImage);

    } catch (error) {
        next(error);
    }
},

deleteProductImageById: async (req, res, next) => {
    try {
        await productsImagesService.deleteProdImagesById(req.params);
        res.status(200).json({ message: 'Imagem do produto deletada com sucesso!' });

    } catch (error) {
        next(error);
    }
},

updateProductImageById: async (req, res, next) => {
    try {

        const [updatedProductImage] = await productsImagesService.updateProdImagesById(req.params, req.body);
        
        res.status(200).json(updatedProductImage);

    } catch (error) {
        next(error);
    }       
},

};



export { productsImagesController };


