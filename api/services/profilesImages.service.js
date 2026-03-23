import supabase from "../supabase";
import { appError } from "../utils/appError.utils";

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
        .maybeSingle;

    if (error) {
      throw new appError("Erro ao criar imagem do perfil: " + error.message, 500);
    }

    return data;    },
}