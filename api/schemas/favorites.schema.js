import z from 'zod';

const params = z.object({ userId: z.string().uuid("ID inválido") });

const baseSchema = z.object({
    
    product_id: z.string({ required_error: "O ID do produto é obrigatório" })
        .uuid("ID do produto inválido")
});

const favoritesSchema = {
    toggle: z.object({
        body: baseSchema,
        params: params
    }),

    getFavoritesByUser: z.object({
        params: params
    })
};

export { favoritesSchema };