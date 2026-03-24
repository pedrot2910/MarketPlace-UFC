import z from 'zod';

const params = z.object({ id: z.string().uuid("ID do perfil inválido") });

const baseSchema = z.object({
    image_url: z.string({ required_error: "A URL da imagem é obrigatória" })
        .url("Formato de URL inválido")
});

const profilesImagesSchema = {
    create: z.object({
        body: baseSchema
    }),
    update: z.object({
        body: baseSchema.partial().strict()
    }),
    
    get: z.object({
        params: params
    })
};

export { profilesImagesSchema };