import { productsImagesService } from "../services/productsImages.service.js";
const productsImagesController = {

    createProductImage: async (req, res) => { 
    try { 
        const { product_id, image_url, is_cover } = req.body; 

        const [newProductImage] = await productsImagesService.createProdImages( 
            product_id, image_url, is_cover
        );

        // Success
        res.status(201).json(newProductImage); 

    } catch (error) { 
        // Internal Error
        res.status(500).json({ error: error.message }); 
        
    }
},

findAllProductsImages: async (req, res) => {
    try {
        const productsImages = await productsImagesService.getAllProdImages();
        res.status(200).json(productsImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

},

findProductImageById: async (req, res) => {
    try {
        const { id } = req.params;
        
        const productImage = await productsImagesService.getProdImagesById(id);
        res.status(200).json(productImage);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

deleteProductImageById: async (req, res) => {
    try {
        const { id } = req.params;

        await productsImagesService.deleteProdImagesById(id);
        res.status(200).json({ message: 'Imagem do produto deletada com sucesso!' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

updateProductImageById: async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const [updatedProductImage] = await productsImagesService.updateProdImagesById(id, updatedData);
        
        res.status(200).json(updatedProductImage);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }       
},

};



export { productsImagesController };