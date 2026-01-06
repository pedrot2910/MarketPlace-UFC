import z from 'zod';

const params = z.object({ id: z.string().uuid("ID do report inválido") });

const baseSchema = z.object({
    reporter_id: z.string({ required_error: "O ID do usuário que reporta é obrigatório" })
        .uuid("ID do usuário inválido"),
    
    product_id: z.string({ required_error: "O ID do produto reportado é obrigatório" })
        .uuid("ID do produto inválido"),

    reason: z.string({ required_error: "O motivo do report é obrigatório" })
        .min(10, "O motivo deve ter pelo menos 10 caracteres")
        .max(500, "O motivo deve ter no máximo 500 caracteres"),
});

const reportsSchema = {
    create: z.object({
        body: baseSchema.omit({ reporter_id: true })
    }),
    findReportById: z.object({
        params: params
    }),
    update: z.object({
        params: params,
        body: z.object({
            status: z.enum(["pending", "reviewed", "resolved"], { required_error: "O status é obrigatório" })
        })
    }),
    delete: z.object({
        params: params
    })
};

export { reportsSchema };