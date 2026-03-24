import supabase from "../supabase.js";
import { appError } from "../utils/appError.utils.js";

const profilesImagesService = {

    createProfileImage: async (id, body) => {
        const { image_url } = body;

        const payload = {
            id: id,
            image_url: image_url
        }
    
        const { data, error } = await supabase
        .from('profile_images')
        .insert(payload)
        .select()
        .maybeSingle();

    if (error) {
      throw new appError("Erro ao criar imagem do perfil: " + error.message, 500);
    }

    return data;    
  },

    getProfileImage: async (id) => {
    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new appError("Erro ao buscar imagem do perfil: " + error.message, 500);
    }

    return data;
  },

    updateProfileImage: async (id, body) => {
    const { image_url } = body;

    const { data, error } = await supabase
      .from('profile_images')
      .update({ image_url: image_url })
      .eq('id', id)
      .select();

    if (error) {
      throw new appError("Erro ao atualizar imagem do perfil: " + error.message, 500);
    }

    return data[0];
  },

  deleteProfileImage: async (id) => {
    const { data: profileImage } = await profilesImagesService.getProfileImage(id);

    if (!profileImage) {
      throw new appError("Imagem do perfil não encontrada.", 404);
    }

    const imageUrl = profileImage.image_url.split('/').pop();

    const { error: storageError } = await supabase.storage
      .from('Marketplace-Images')
      .remove([imageUrl]);

    if (storageError) {
      throw new appError("Erro ao deletar imagem do perfil: " + storageError.message, 500);
    }

    const { error } = await supabase
      .from('profile_images')
      .delete()
      .eq('id', id);
        
        if (error) {
            throw new appError("Erro ao deletar imagem do perfil: " + error.message, 500);
        }

        return true;

    },
}

export { profilesImagesService };