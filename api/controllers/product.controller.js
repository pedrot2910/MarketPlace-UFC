import { productService } from "../services/product.service.js";
import { productsImagesService } from "../services/productsImages.service.js";

const productController = {
  createProduct: async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        category_id,
        condition,
        type,
        product_images,
      } = req.body;

      const profile_id = req.user.id;

      const [newProduct] = await productService.createProduct({
        title,
        description,
        price,
        profile_id,
        category_id,
        condition,
        type,
      });

      if (product_images && product_images.length > 0) {
        for (const url of product_images) {
          await productsImagesService.createProdImages(
            newProduct.id,
            url,
            true
          );
        }
      }

      res.status(201).json({
        message: "Produto criado com sucesso!",
        product: newProduct,
        images: product_images,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  findAllProducts: async (req, res) => {
    try {
      const { search, categoryId } = req.query;
      const products = await productService.getAllProducts({
        search,
        categoryId,
      });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  findProductById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  findProductsByProfile: async (req, res) => {
    try {
      const { profileId } = req.params;

      const products = await productService.getProductsByProfileId(profileId);

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProductById: async (req, res) => {
    try {
      const { id } = req.params;

      await productService.deleteProductById(id);
      res.status(200).json({ message: "Produto deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const [updatedProduct] = await productService.updateProductById(
        id,
        updatedData
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export { productController };
