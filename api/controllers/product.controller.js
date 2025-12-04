import {productService} from '../services/product.services.js'; 

const productController = {

createProduct: async (req, res) => { 
    try { 
        const { nome, descricao, preco, imagem_url } = req.body; 

        
        if (!nome || !preco) { 
            return res.status(400).json({ erro: 'Nome e preço são obrigatórios!' }); 
        }

        const newProduct = await productService.createProduct({ 
            nome, descricao, preco, imagem_url
        });

        // Sucesso
        res.status(201).json(newProduct); 

    } catch (error) { 
        // Erro Interno
        res.status(500).json({ erro: error.message }); 
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
        
        if (!id|| id != Number) {
            return res.status(400).json({ error: 'ID do produto é obrigatório!' });
        }

        const product = await productService.getProductById(id);
        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

};

export { productController };