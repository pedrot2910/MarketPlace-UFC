import supabase from '../supabase.js';

const profilesService = {
  createProfile: async (productData) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([productData])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getAllProfiles: async () => {
    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getProfileById: async (id) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  deleteProfileById: async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
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

  updateProfileById: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getProfileImage: async (profileId) => {
    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  createProfileImage: async (profileId, imageUrl) => {
    const { data, error } = await supabase
      .from('profile_images')
      .insert([{ id: profileId, image_url: imageUrl }])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  },

  updateProfileImage: async (profileId, imageUrl) => {
    const { data, error } = await supabase
      .from('profile_images')
      .update({ image_url: imageUrl })
      .eq('id', profileId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  },

  deleteProfileImage: async (profileId) => {
    const { error } = await supabase
      .from('profile_images')
      .delete()
      .eq('id', profileId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },
};

export { profilesService };
