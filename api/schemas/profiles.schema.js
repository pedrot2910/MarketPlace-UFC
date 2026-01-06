import z from 'zod'; // Corrigido 'zod' para 'zod' string

const params = z.object({ id: z.string().uuid("ID do perfil inválido") });

const baseSchema = z.object({
    name: z.string({ required_error: "O nome é obrigatório" })
        .min(3, "O nome deve ter pelo menos 3 caracteres")
        .max(100, "O nome deve ter no máximo 100 caracteres"),

    email: z.string({ required_error: "O email é obrigatório" })
        .email("Formato de email inválido"),

    matricula: z.string({ required_error: "A matrícula é obrigatória" })
        .min(3, "A matrícula deve ter pelo menos 3 caracteres")
        .max(20, "A matrícula deve ter no máximo 20 caracteres"),
});

const profilesSchema = {
    update: z.object({
        params: params,
        body: baseSchema.pick({ name: true, email: true}).partial().strict()
    }),
    getProfileById: z.object({
        params: params
    }),
    delete: z.object({
        params: params
    })
};

export { profilesSchema };