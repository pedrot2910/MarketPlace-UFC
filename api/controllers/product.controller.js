import {productService} from '../services/product.services.js'; 

const productController = {

createProduct: async (req, res) => { 
    try { 
        const { name, description, price, image_url } = req.body; 

        
        if (!name || !price) { 
            return res.status(400).json({ error: 'Name and price are required!' }); 
        }

        const newProduct = await productService.createProduct({ 
            name, description, price, image_url
        });

        // Success
        res.status(201).json(newProduct); 

    } catch (error) { 
        // Internal Error
        res.status(500).json({ error: error.message }); 
    }
},

findAllProducts: async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

},

findProductById: async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'ID do produto é obrigatório!' });
        }

        const product = await productService.getProductById(id);
        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

deleteProductById: async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'ID do produto é obrigatório!' });
        }

        await productService.deleteProductById(id);
        res.status(200).json({ message: 'Produto deletado com sucesso!' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

updateProductById: async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        if (!id) {
            return res.status(400).json({ error: 'ID do produto é obrigatório!' });
        }   
        const updatedProduct = await productService.updateProductById(id, updatedData);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }       
},

};

export { productController };