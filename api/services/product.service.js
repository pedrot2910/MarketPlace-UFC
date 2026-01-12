import supabase from "../supabase.js";

const productService = {
  createProduct: async (productData) => {
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  getAllProducts: async (filters = {}) => {
    let query = supabase
      .from("products")
      .select(
        `
                *,
                profiles ( name, email, matricula ),
                categories ( namecategories ),
                product_images ( image_url, is_cover ) 
            `
      )
      .order("created_at", { ascending: false });

    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }
    if (filters.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data;
  },

  getProductById: async (id) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
                *,
                profiles ( name, email, matricula ),
                categories ( namecategories ),
                product_images ( image_url, is_cover )
            `
      )
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
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
    `
      )
      .eq("profile_id", profileId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // 4. Deletar
  deleteProductById: async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  },

  // 5. Atualizar
  updateProductById: async (id, updatedData) => {
    const { data, error } = await supabase
      .from("products")
      .update(updatedData)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  },
};

export { productService };
