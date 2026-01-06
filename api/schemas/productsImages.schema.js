import z from 'zod';

const params = z.object({ id: z.string().uuid("ID da imagem inválido") });

const baseSchema = z.object({
    product_id: z.string({ required_error: "O ID do produto é obrigatório" })
        .uuid("ID do produto inválido"),

    image_url: z.string({ required_error: "A URL da imagem é obrigatória" })
        .url("URL da imagem inválida"),
    
    is_cover: z.boolean().optional()
});

const productsImagesSchema = {
    create: z.object({
        body: baseSchema
    }),
    findProductImageById: z.object({
        params: params
    }),
    update: z.object({
        params: params,
        body: baseSchema.partial()
    }),
    delete: z.object({
        params: params
    })

};

export { productsImagesSchema };