import supabase from '../supabase.js';

const uploadService = {
    uploadToStorage: async (file) => {

        const cleanName = file.originalname.replace(/\s/g, '_');
        const nomeUnico = `${Date.now()}-${cleanName}`;

        const { data, error } = await supabase
            .storage
            .from('Marketplace-Images') 
            .upload(nomeUnico, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            throw new Error(`Erro no Supabase: ${error.message}`);
        }

        const { data: publicUrl } = supabase
            .storage
            .from('Marketplace-Images')
            .getPublicUrl(nomeUnico);

        return publicUrl.publicUrl;
    }
};

export { uploadService };