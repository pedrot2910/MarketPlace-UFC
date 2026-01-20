import supabase from "../supabase.js";

const productService = {
  createProduct: async (productData) => {
    const { lat, lng, ...rest } = productData;

    // Formata a localização para o padrão PostGIS se as coordenadas existirem
    const payload = {
      ...rest,
      location: lat && lng ? `POINT(${lng} ${lat})` : null,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  getAllProducts: async (filters = {}) => {
    try {
      let query = supabase
        .from("products")
        .select(
          `
          *,
          profiles ( id, name, email, matricula ),
          categories ( namecategories ),
          product_images ( image_url, is_cover )
        `,
        )
        .eq("status", "ativo");

      // --- LÓGICA DE LOCALIZAÇÃO ---
      if (filters.lat && filters.lng) {
        // 1. Chama sua função RPC para pegar os IDs próximos
        const { data: nearbyIds, error: rpcError } = await supabase.rpc(
          "get_nearby_product_ids",
          {
            user_lat: parseFloat(filters.lat),
            user_lng: parseFloat(filters.lng),
            radius_meters: parseFloat(filters.radius || 5000),
          },
        );

        if (rpcError) throw rpcError;

        // Se não encontrou nada perto, retorna array vazio imediatamente
        if (!nearbyIds || nearbyIds.length === 0) return [];

        // 2. Filtra a query principal para trazer apenas esses IDs
        const ids = nearbyIds.map((item) => item.id);
        query = query.in("id", ids);
      }

      // --- OUTROS FILTROS (Busca e Categoria) ---
      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }
      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      // Ordenação padrão (se não houver localização, ordena por data)
      // Se houver localização, os IDs geralmente já vêm na ordem de proximidade do RPC
      if (!filters.lat) {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Ordenar imagens para que a capa venha primeiro (Lógica mantida)
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
    } catch (error) {
      console.error("Erro no productService:", error.message);
      throw new Error(error.message);
    }
  },
  getProductById: async (id) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
                *,
                profiles ( id, name, email, matricula ),
                categories ( namecategories ),
                product_images ( image_url, is_cover )
            `,
      )
      .eq("id", id)
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
          .from("profile_images")
          .select("image_url")
          .eq("id", data.profile_id)
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
      .from("products")
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
      .eq("profile_id", profileId);

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
        .from("messages")
        .delete()
        .eq("product_id", id);

      if (messagesError) {
        console.error("Erro ao deletar mensagens:", messagesError);
        throw new Error(`Erro ao deletar mensagens: ${messagesError.message}`);
      }

      // Deletar todos os relatórios relacionados ao produto
      const { error: reportsError } = await supabase
        .from("reports")
        .delete()
        .eq("product_id", id);

      if (reportsError) {
        console.error("Erro ao deletar relatórios:", reportsError);
        throw new Error(`Erro ao deletar relatórios: ${reportsError.message}`);
      }

      // Deletar todos os favoritos relacionados ao produto
      const { error: favoritesError } = await supabase
        .from("favorites")
        .delete()
        .eq("product_id", id);

      if (favoritesError) {
        console.error("Erro ao deletar favoritos:", favoritesError);
        throw new Error(`Erro ao deletar favoritos: ${favoritesError.message}`);
      }

      // Deletar as imagens do produto
      const { error: imagesError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", id);

      if (imagesError) {
        console.error("Erro ao deletar imagens:", imagesError);
        throw new Error(`Erro ao deletar imagens: ${imagesError.message}`);
      }

      // Por fim, deletar o produto
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("Erro ao deletar produto:", error);
        throw new Error(`Erro ao deletar produto: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error("Erro geral ao deletar produto:", error);
      throw error;
    }
  },

  // 5. Atualizar
  updateProductById: async (id, updatedData) => {
    const { lat, lng, ...rest } = updatedData;

    const payload = { ...rest };
    if (lat && lng) {
      payload.location = `POINT(${lng} ${lat})`;
    }

    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  },
};

export { productService };
