import supabase from '../supabase.js';
import { appError } from '../utils/appError.utils.js';

const profilesService = {
  createProfile: async (profileData) => {

    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select();

    if (error) {
      throw new appError(error.message, 500);
    }

    return data;
  },

  getAllProfiles: async () => {
    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
      throw new appError(error.message, 500);
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
      throw new appError(error.message, 500);
    }

    // Buscar foto de perfil separadamente
    if (data) {
      const { data: profileImage } = await supabase
        .from('profile_images')
        .select('image_url')
        .eq('id', id)
        .single();

      if (profileImage) {
        data.profile_images = [profileImage];
      }
    }

    return data;
  },

  deleteProfileById: async (params) => {
    const { id } = params;
    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      throw new appError(error.message, 500);
    }

    return true;
  },

  getProductsByProfileId: async (params) => {
    const { id: profile_id } = params;
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
      .eq('profile_id', profile_id);

    if (error) {
      throw new appError(error.message, 500);
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
      throw new appError(error.message, 500);
    }

    return data;
  },

  getProfileImage: async (params) => {
    const { id } = params;
    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new appError(error.message, 500);
    }

    return data;
  },

  createProfileImage: async (id, body) => {
    const { image_url } = body;
    
    const { data, error } = await supabase
      .from('profile_images')
      .insert([{ id: id, image_url: image_url }])
      .select();

    if (error) {
      throw new appError(error.message, 500);
    }

    return data[0];
  },

  updateProfileImage: async (id, body) => {
    const { image_url } = body;

    const { data, error } = await supabase
      .from('profile_images')
      .update({ image_url: image_url })
      .eq('id', id)
      .select();

    if (error) {
      throw new appError(error.message, 500);
    }

    return data[0];
  },

  deleteProfileImage: async (id) => {
    const { error } = await supabase
      .from('profile_images')
      .delete()
      .eq('id', id);

    if (error) {
      throw new appError(error.message, 500);
    }

    return true;
  },
};

export { profilesService };
