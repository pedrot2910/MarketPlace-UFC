import z from 'zod';

const params = z.object({ id: z.string().uuid("ID inválido") });

const baseSchema = z.object({
    namecategories: z.string({ required_error: "O nome da categoria é obrigatório" })
        .min(3, "O nome da categoria deve ter pelo menos 3 caracteres")
        .max(50, "O nome da categoria deve ter no máximo 50 caracteres"),

    icon: z.string().url("URL do ícone inválida").optional()
});

const categorySchema = {
    create: z.object({
        body: baseSchema
    }),

    findCategoryById: z.object({
        params: params
    }),

    update: z.object({
        params: params,
        body: baseSchema.partial()
    }),

    delete: z.object({
        params: params
    }),
};

export { categorySchema };