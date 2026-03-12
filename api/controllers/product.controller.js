import { productService } from '../services/product.service.js';
import { productsImagesService } from '../services/productsImages.service.js';
import supabase from '../supabase.js';

const productController = {
  createProduct: async (req, res, next) => {
    try {

      const newProduct = await productService.createProduct(req.body, req.user.id);

      res.status(201).json({
        message: 'Produto criado com sucesso!',
        product: newProduct,
        
      });
      
    } catch (error) {
      next(error);
    }
  },

  getAllProducts: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts(req.query);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  getProductsByProfileId: async (req, res, next ) => {
    try {
      const { profileId } = req.params;

      const products = await productService.getProductsByProfileId(profileId);

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },

  deleteProductById: async (req, res, next) => {
    try {
      const { id } = req.params;

      await productService.deleteProductById(id, req.user.id);
      res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (error) {
      next(error);
    }
  },

  updateProductById: async (req, res, next) => {
    try {
      console.log('🔍 Atualizando produto - ID:', req.params.id, 'User ID:', req.user.id, 'Payload:', req.body);
      const prodData = await productService.updateProductById(req.user.id, req.params.id, req.body);
      console.log(prodData);
      res.status(200).json({
        message: 'Produto atualizado com sucesso!',
        product: prodData,
      });

    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error);
      next(error);
    }
  },

};

export { productController };
