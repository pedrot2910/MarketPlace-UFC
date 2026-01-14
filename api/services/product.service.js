import supabase from '../supabase.js';

const productService = {
  createProduct: async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  getAllProducts: async (filters = {}) => {
    let query = supabase
      .from('products')
      .select(
        `
                *,
                profiles ( id, name, email, matricula ),
                categories ( namecategories ),
                product_images ( image_url, is_cover )
            `,
      )
      .order('created_at', { ascending: false });

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Ordenar imagens para que a capa venha primeiro
    if (data) {
      data.forEach((product) => {
        if (product.product_images) {
          product.product_images.sort((a, b) => {
            if (a.is_cover && !b.is_cover) return -1;
            if (!a.is_cover && b.is_cover) return 1;
            return 0;
          });
        }
      });
    }

    return data;
  },

  getProductById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
                *,
                profiles ( id, name, email, matricula ),
                categories ( namecategories ),
                product_images ( image_url, is_cover )
            `,
      )
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    // Ordenar imagens para que a capa venha primeiro
    if (data && data.product_images) {
      data.product_images.sort((a, b) => {
        if (a.is_cover && !b.is_cover) return -1;
        if (!a.is_cover && b.is_cover) return 1;
        return 0;
      });
    }

    // Buscar foto de perfil do vendedor
    if (data && data.profile_id) {
      try {
        const { data: profileImage } = await supabase
          .from('profile_images')
          .select('image_url')
          .eq('id', data.profile_id)
          .single();

        if (profileImage) {
          data.profile_images = [profileImage];
        }
      } catch (err) {
        // Sem foto de perfil
      }
    }

    return data;
  },

  getProductsByProfileId: async (profileId) => {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
      *,
      profiles (
        id,
        name
      ),
      product_images (
        image_url,
        is_cover
      )
    `,
      )
      .eq('profile_id', profileId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // 4. Deletar
  deleteProductById: async (id) => {
    try {
      // Primeiro, deletar todas as mensagens relacionadas ao produto
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('product_id', id);

      if (messagesError) {
        console.error('Erro ao deletar mensagens:', messagesError);
        throw new Error(`Erro ao deletar mensagens: ${messagesError.message}`);
      }

      // Deletar todos os relatórios relacionados ao produto
      const { error: reportsError } = await supabase
        .from('reports')
        .delete()
        .eq('product_id', id);

      if (reportsError) {
        console.error('Erro ao deletar relatórios:', reportsError);
        throw new Error(`Erro ao deletar relatórios: ${reportsError.message}`);
      }

      // Deletar todos os favoritos relacionados ao produto
      const { error: favoritesError } = await supabase
        .from('favorites')
        .delete()
        .eq('product_id', id);

      if (favoritesError) {
        console.error('Erro ao deletar favoritos:', favoritesError);
        throw new Error(`Erro ao deletar favoritos: ${favoritesError.message}`);
      }

      // Deletar as imagens do produto
      const { error: imagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', id);

      if (imagesError) {
        console.error('Erro ao deletar imagens:', imagesError);
        throw new Error(`Erro ao deletar imagens: ${imagesError.message}`);
      }

      // Por fim, deletar o produto
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        throw new Error(`Erro ao deletar produto: ${error.message}`);
      }
      
      return true;
    } catch (error) {
      console.error('Erro geral ao deletar produto:', error);
      throw error;
    }
  },

  // 5. Atualizar
  updateProductById: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('products')
      .update(updatedData)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  },
};

export { productService };
