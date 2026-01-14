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
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw new Error(error.message);
    return true;
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
