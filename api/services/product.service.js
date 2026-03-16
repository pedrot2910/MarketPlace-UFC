import supabase from "../supabase.js";
import { productsImagesService } from "./productsImages.service.js";
import { appError } from "../utils/appError.utils.js";
import { notificationsService } from "./notifications.service.js";
const productService = {
  createProduct: async (body, userId) => {
    const {
      lat,
      lng,
      product_images,
      images_to_remove,
      cover_image_url,
      ...rest
    } = body;

    // Formata a localização para o padrão PostGIS se as coordenadas existirem
    const payload = {
      ...rest,
      profile_id: userId,
      location: lat && lng ? `POINT(${lng} ${lat})` : null,
    };

    const { data: newProduct, error } = await supabase
      .from("products")
      .insert([payload])
      .select()
      .single();

    if (error) throw new appError(error.message, 500);

    const { error: imgError } = await Promise.all(
      product_images.map((image, index) =>
        productsImagesService.createProdImages({
          product_id: newProduct.id,
          image_url: image,
          is_cover: index === 0,
        }),
      ),
    );

    if (imgError) throw new appError(imgError.message, 500);

    return newProduct;
  },

  getAllProducts: async (filters = {}) => {
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

      if (rpcError) throw new appError(rpcError.message, 500);

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
    if (error) throw new appError(error.message, 500);

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

    if (error) throw new appError(error.message, 500);

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
      const { data: profileImage, error: profileImageError } = await supabase
        .from("profile_images")
        .select("image_url")
        .eq("id", data.profile_id)
        .maybeSingle();

      if (profileImageError) {
        throw new appError(
          "Erro ao buscar foto de perfil do vendedor: " +
            profileImageError.message,
          500,
        );
      }

      data.profile_images = profileImage ? [profileImage] : null;
    }

    return data;
  },

  markAsSold: async (id, userId) => {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, profile_id, title, status")
      .eq("id", id)
      .single();

    if (productError) throw new appError("Produto não encontrado: ", 404);
    if (product.profile_id !== userId)
      throw new appError("Não autorizado", 403);
    if (product.status === "vendido")
      throw new appError("Produto já está marcado como vendido", 400);

    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update({ status: "vendido" })
      .eq("id", id)
      .select()
      .single();

    if (updateError)
      throw new appError(
        "Erro ao marcar como vendido: " + updateError.message,
        500,
      );

    const { data: favorites, error: favoritesError } = await supabase
      .from("favorites")
      .select("user_id")
      .eq("product_id", id);

    if (favoritesError)
      throw new appError(
        "Erro ao buscar favoritos para notificações: " + favoritesError.message,
        500,
      );

    // Criar notificações para os usuários que favoritaram o produto
    if (favorites && favorites.length > 0) {
      const notifications = await notificationsService.createNotification({
        userId: favorites.map((fav) => fav.user_id),
        message: `O produto ${product.title} foi marcado como vendido!`,
        is_read: false,
      });

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (notificationError)
        throw new appError(
          "Erro ao criar notificações: " + notificationError.message,
          500,
        );
    }

    return updatedProduct;
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
      throw new appError(error.message, 500);
    }

    return data;
  },

  // 4. Deletar
  deleteProductById: async (id, userId) => {
    // Primeiro, deletar todas as mensagens relacionadas ao produto

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, profile_id")
      .eq("id", id)
      .single();

    if (productError) {
      console.error("Erro ao buscar produto:", productError);
      throw new appError(
        `Erro ao buscar produto: ${productError.message}`,
        500,
      );
    }

    if (product.profile_id !== userId) {
      throw new appError(
        "Usuário não autorizado para deletar este produto",
        403,
      );
    }

    const { error: messagesError } = await supabase
      .from("messages")
      .delete()
      .eq("product_id", id);

    if (messagesError) {
      console.error("Erro ao deletar mensagens:", messagesError);
      throw new appError(
        `Erro ao deletar mensagens: ${messagesError.message}`,
        500,
      );
    }

    // Deletar todos os relatórios relacionados ao produto
    const { error: reportsError } = await supabase
      .from("reports")
      .delete()
      .eq("product_id", id);

    if (reportsError) {
      console.error("Erro ao deletar relatórios:", reportsError);
      throw new appError(
        `Erro ao deletar relatórios: ${reportsError.message}`,
        500,
      );
    }

    // Deletar todos os favoritos relacionados ao produto
    const { error: favoritesError } = await supabase
      .from("favorites")
      .delete()
      .eq("product_id", id);

    if (favoritesError) {
      console.error("Erro ao deletar favoritos:", favoritesError);
      throw new appError(
        `Erro ao deletar favoritos: ${favoritesError.message}`,
        500,
      );
    }

    // Deletar as imagens do produto
    const { error: imagesError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id);

    if (imagesError) {
      console.error("Erro ao deletar imagens:", imagesError);
      throw new appError(
        `Erro ao deletar imagens: ${imagesError.message}`,
        500,
      );
    }

    // Por fim, deletar o produto
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar produto:", error);
      throw new appError(`Erro ao deletar produto: ${error.message}`, 500);
    }

    return true;
  },

  // 5. Atualizar
  updateProductById: async (userId, id, body) => {
    const {
      lat,
      lng,
      product_images,
      images_to_remove,
      cover_image_url,
      ...rest
    } = body;

    const payload = { ...rest };

    if (lat && lng) {
      payload.location = `POINT(${lng} ${lat})`;
    }

    const { data: existingProduct, error: existingProductError } =
      await supabase
        .from("products")
        .select("id, profile_id")
        .eq("id", id)
        .single();

    if (existingProductError) {
      throw new appError(existingProductError.message, 404);
    }

    if (existingProduct.profile_id !== userId) {
      throw new appError(
        "Usuário não autorizado para atualizar este produto",
        403,
      );
    }
    let prodData;
    if (Object.keys(payload).length > 0) {
      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id)
        .eq("profile_id", userId)
        .select()
        .single();

      if (error) throw new appError(error.message);

      prodData = data;
    }

    // const {
    //     product_images,
    //     images_to_remove,
    //     cover_image_url,
    //     ...updatedData
    //   } = body;

    console.log("📝 UPDATE PRODUTO:", {
      id,
      product_images,
      images_to_remove,
      cover_image_url,
      updatedData: rest,
    });

    // Remover imagens antigas se solicitado
    if (
      images_to_remove &&
      Array.isArray(images_to_remove) &&
      images_to_remove.length > 0
    ) {
      console.log("🗑️ Removendo imagens:", images_to_remove);

      // Buscar a imagem pelo URL e deletar
      const { data: images, error: searchError } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", id)
        .in("image_url", images_to_remove);

      if (searchError) {
        console.error("Erro ao buscar imagens para remoção:", searchError);
        throw new appError(
          `Erro ao buscar imagens para remoção: ${searchError.message}`,
          500,
        );
      }

      if (images && images.length > 0) {
        const deleteResult = await Promise.all(
          images.map((img) =>
            productsImagesService.deleteProdImagesById(img.id),
          ),
        );
        console.log("✅ Imagem deletada:", deleteResult);
      }
    }

    // Se foram enviadas novas imagens, adicionar à tabela product_images
    if (
      product_images &&
      Array.isArray(product_images) &&
      product_images.length > 0
    ) {
      console.log("➕ Adicionando novas imagens:", product_images);
      // Adicionar novas imagens

      await Promise.all(
        product_images.map((url) =>
          productsImagesService.createProdImages({
            product_id: id,
            image_url: url,
            is_cover: false,
          }),
        ),
      );
    }

    // Atualizar imagem de capa se especificada
    if (cover_image_url) {
      console.log("🖼️ Atualizando capa para:", cover_image_url);

      // Primeiro, remover is_cover de todas as imagens do produto
      const { error: resetError } = await supabase
        .from("product_images")
        .update({ is_cover: false })
        .eq("product_id", id);

      console.log("🔄 Reset is_cover:", resetError || "OK");

      if (resetError) {
        console.error("Erro ao resetar is_cover:", resetError);
        throw new appError(
          `Erro ao resetar is_cover: ${resetError.message}`,
          500,
        );
      }

      // Depois, definir a nova capa
      const { error: setCoverError } = await supabase
        .from("product_images")
        .update({ is_cover: true })
        .eq("product_id", id)
        .eq("image_url", cover_image_url);

      console.log("✅ Set nova capa:", setCoverError || "OK");

      if (setCoverError) {
        console.error("Erro ao definir nova capa:", setCoverError);
        throw new appError(
          `Erro ao definir nova capa: ${setCoverError.message}`,
          500,
        );
      }
    }

    console.log("Produto atualizado com sucesso:", prodData);

    return prodData;
  },
};
export { productService };
