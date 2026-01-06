import { uploadService } from '../services/upload.service.js';

export const uploadController = {
    uploadImage: async (req, res) => {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }

            const publicUrl = await uploadService.uploadToStorage(file);

            res.status(200).json({ 
                message: 'Upload realizado com sucesso!',
                link: publicUrl 
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};