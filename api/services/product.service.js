import supabase from "../supabase.js";
import { productsImagesService } from "./productsImages.service.js";
import { appError } from "../utils/appError.utils.js";
const productService = {
  
  createProduct: async (body, userId) => {

    const { lat, lng, product_images, images_to_remove, cover_image_url, ...rest } = body;

    // Formata a localização para o padrão PostGIS se as coordenadas existirem
    const payload = {
      ...rest,
      profile_id: userId,
    };

    // Só inclui location se as coordenadas forem fornecidas
    if (lat && lng) {
      payload.location = `POINT(${lng} ${lat})`;
    }

    const { data: newProduct, error } = await supabase
      .from("products")
      .insert([payload])
      .select()
      .single();

  if (error) throw new appError(error.message);

  if (product_images && Array.isArray(product_images) && product_images.length > 0) {
    await Promise.all(
      product_images.map((image, index) =>
        productsImagesService.createProdImages({
          product_id: newProduct.id,
          image_url: image,
          is_cover: index === 0,
        }),
      ),
    );

  }
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
          throw new appError("Erro ao buscar foto de perfil do vendedor: " + profileImageError.message, 500);
        }
      
        data.profile_images = profileImage ? [profileImage] : null;
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
      throw new appError(error.message, 500);
    }

    return data;
  },

  // 4. Deletar
  deleteProductById: async (id, userId) => {
      const profile_id = userId;
      // Deletar as imagens do produto
      console.log('Iniciando deleção de produto - ID:', id, 'User ID:', userId);

      const { error: imagesError } = await productsImagesService.deleteProdImagesByProductId(id);

      if (imagesError) {
        console.error("Erro ao deletar imagens:", imagesError);
        throw new appError(`Erro ao deletar imagens: ${imagesError.message}`, 500);
      }

      // Por fim, deletar o produto
      const { data, error } = await supabase.from("products").delete().eq("id", id).eq("profile_id", profile_id). select();

      console.log('Deletar produto:', { id, userId, data, error });

      if (error) {
        console.error("Erro ao deletar produto:", error);
        throw new appError(`Erro ao deletar produto: ${error.message}`, 500);
      }

      return data;
  },

  // 5. Atualizar
  updateProductById: async (userId, id, body) => {
    const { lat, lng,
      product_images,
      images_to_remove,
      cover_image_url, 
      ...rest } = body;

    const payload = { ...rest };

    if (lat && lng) {
      payload.location = `POINT(${lng} ${lat})`;
    }

    console.log('🛠️ Atualizando produto:', { id, userId, payload });

    const {data: existingProduct, error: existingProductError } = await supabase
      .from("products")
      .select("id, profile_id")
      .eq("id", id)
      .eq("profile_id", userId)
      .maybeSingle();
      

    if (existingProductError) {
      throw new appError(existingProductError.message, 404);
    }

    if (!existingProduct) { // <--- Verifique se o objeto existe
      throw new appError("Produto não encontrado ou não pertence ao usuário", 404);
    }

    if (existingProduct.profile_id !== userId) {
      throw new appError("Usuário não autorizado para atualizar este produto", 403);
    }

    let prodData = existingProduct; // Inicia com os dados existentes

    if (Object.keys(payload).length > 0) {

      const { data, error } = await supabase.from("products")
      .update(payload)
      .eq("id", id)
      .eq("profile_id", userId)
      .select();

      if (error) throw new appError(error.message);
      if (!data || data.length === 0) throw new appError("Produto não encontrado ou não pertence ao usuário", 404);

      prodData = data[0]; // Atualiza com os dados do update, se houver
    }


    // const 
    //     product_images,
    //     images_to_remove,
    //     cover_image_url,
    //     ...updatedData
    //   } = body;

      console.log('📝 UPDATE PRODUTO:', {
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
        
        console.log('🗑️ Removendo imagens:', images_to_remove);

        await productsImagesService.deleteProdImagesByUrls(id, images_to_remove);
    
    console.log('✅ Storage e Banco limpos com sucesso');
          
      }
      

      // Se foram enviadas novas imagens, adicionar à tabela product_images
      if (
        product_images &&
        Array.isArray(product_images) &&
        product_images.length > 0
      ) {

        console.log('➕ Adicionando novas imagens:', product_images);
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
        console.log('🖼️ Atualizando capa para:', cover_image_url);

        // Primeiro, remover is_cover de todas as imagens do produto
        const { error: resetError } = await supabase
          .from('product_images')
          .update({ is_cover: false })
          .eq('product_id', id);

        console.log('🔄 Reset is_cover:', resetError || 'OK');

        if (resetError) {
          console.error('Erro ao resetar is_cover:', resetError);
          throw new appError(`Erro ao resetar is_cover: ${resetError.message}`, 500);
        }

        // Depois, definir a nova capa
        const { error: setCoverError } = await supabase
          .from('product_images')
          .update({ is_cover: true })
          .eq('product_id', id)
          .eq('image_url', cover_image_url);

        console.log('✅ Set nova capa:', setCoverError || 'OK');

        if (setCoverError) {
        console.error('Erro ao definir nova capa:', setCoverError);
        throw new appError(`Erro ao definir nova capa: ${setCoverError.message}`, 500);
        }

      }
      
      console.log('Produto atualizado com sucesso:', prodData);

      return prodData;
  },

};
export { productService };
