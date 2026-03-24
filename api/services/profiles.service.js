import supabase from '../supabase.js';
import { appError } from '../utils/appError.utils.js';
import { profilesImagesService } from './profilesImages.service.js';

const profilesService = {
  createProfile: async (profileData) => {

    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select();

    if (error) {
      throw new appError("Erro ao criar perfil: " + error.message, error.code);
    }

    return data;
  },

  getAllProfiles: async () => {
    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
      throw new appError("Erro ao buscar todos os perfis: " + error.message, 404);
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
      throw new appError("Erro ao buscar perfil por id: " + error.message, 404);
    }

    // Buscar foto de perfil separadamente
    if (data) {

      const { data: profileImage } = await profilesImagesService.getProfileImage(id);

      if (!profileImage) {
        data.profile_images = [];
        
        console.log("⚠️ Nenhuma imagem de perfil encontrada para o usuário com id:", id);
      }

      if (profileImage) {
        data.profile_images = [profileImage];
      }
    }

    return data;
  },

  getProfileMat: async (matricula) => {

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('matricula', matricula)
      .maybeSingle();

    if (error) {
      throw new appError("Erro ao procurar matricula existente no banco: " + error.message, 500);
    }

    return data;
  },

  deleteProfileById: async (params) => {
    const { id } = params;
    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      throw new appError("Erro ao deletar perfil: " + error.message, 500);
    }

    return true;
  },

  getProductsByProfileId: async (params) => {
    const { id: profile_id } = params;
    const { data, error } = await supabase
      .from('products')
      .select(
        `*,
        profiles (id, name),
        product_images (image_url, is_cover)`,
      )
      .eq('profile_id', profile_id);

    if (error) {
      throw new appError("Erro ao buscar produtos do perfil: " + error.message, 500);
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
      throw new appError("Erro ao atualizar perfil: " + error.message, 500);
    }

    return data;
  },
  
};

export { profilesService };
