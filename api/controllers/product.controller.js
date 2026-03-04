import { productService } from '../services/product.service.js';
import { productsImagesService } from '../services/productsImages.service.js';
import supabase from '../supabase.js';

const productController = {
  createProduct: async (req, res, next) => {
    try {

      const { product_images} = req.body;

      const [newProduct] = await productService.createProduct(req.body, req.user.id);

      res.status(201).json({
        message: 'Produto criado com sucesso!',
        product: newProduct,
        images: product_images,
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
      const { id } = req.params;
      const {
        product_images,
        images_to_remove,
        cover_image_url,
        ...updatedData
      } = req.body;

      console.log('📝 UPDATE PRODUTO:', {
        id,
        product_images,
        images_to_remove,
        cover_image_url,
        updatedData,
      });

      // Remover imagens antigas se solicitado
      if (
        images_to_remove &&
        Array.isArray(images_to_remove) &&
        images_to_remove.length > 0
      ) {
        console.log('🗑️ Removendo imagens:', images_to_remove);
        for (const imageUrl of images_to_remove) {
          // Buscar a imagem pelo URL e deletar
          const { data: images, error: searchError } = await supabase
            .from('product_images')
            .select('id')
            .eq('product_id', id)
            .eq('image_url', imageUrl);

          console.log('🔍 Busca imagem:', {
            imageUrl,
            found: images?.length,
            error: searchError,
          });

          if (images && images.length > 0) {
            const deleteResult =
              await productsImagesService.deleteProdImagesById(images[0].id);
            console.log('✅ Imagem deletada:', images[0].id, deleteResult);
          }
        }
      }

      // Atualizar dados do produto (sem as imagens)
      const [updatedProduct] = await productService.updateProductById(
        id,
        req.body,
      );

      // Se foram enviadas novas imagens, adicionar à tabela product_images
      if (
        product_images &&
        Array.isArray(product_images) &&
        product_images.length > 0
      ) {
        console.log('➕ Adicionando novas imagens:', product_images);
        // Adicionar novas imagens
        for (const url of product_images) {
          await productsImagesService.createProdImages(
            id,
            url,
            false, // novas imagens não são capa por padrão
          );
        }
      }

      // Atualizar imagem de capa se especificada
      if (cover_image_url) {
        console.log('🖼️ Atualizando capa para:', cover_image_url);

        // Primeiro, remover is_cover de todas as imagens do produto
        const { error: resetError } = await supabase
          .from('product_images')
          .update({ is_cover: false })
          .eq('product_id', id);

        console.log('🔄 Reset is_cover:', resetError || 'OK');

        // Depois, definir a nova capa
        const { error: setCoverError } = await supabase
          .from('product_images')
          .update({ is_cover: true })
          .eq('product_id', id)
          .eq('image_url', cover_image_url);

        console.log('✅ Set nova capa:', setCoverError || 'OK');
      }

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error);
      next(error);
    }
  },

};

export { productController };
