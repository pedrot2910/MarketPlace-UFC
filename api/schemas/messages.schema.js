import z from 'zod';

// Parametro genérico (para findById e deleteById)
const idParam = z.object({ id: z.string().uuid("ID inválido") });

// Parametro específico (para getByUser) - assumindo que a rota é /user/:userId
const userIdParam = z.object({ userId: z.string().uuid("ID de usuário inválido") });

const baseSchema = z.object({
    sender_id: z.string().uuid("ID do remetente inválido"),
    receiver_id: z.string().uuid("ID do destinatário inválido"),
    product_id: z.string().uuid("ID do produto inválido"), 
    message: z.string()
        .min(1, "A mensagem não pode ser vazia")
        .max(1000, "Máximo de 1000 caracteres"),
    image_url: z.string().url("URL inválida").optional(),
});

const messagesSchema = {
    create: z.object({
        body: baseSchema.refine((data) => data.sender_id !== data.receiver_id, {
            message: "Você não pode enviar mensagens para si mesmo.",
            path: ["receiver_id"] // O erro aponta para o campo receiver_id
        })
    }),

    getMessagesByUser: z.object({
        params: userIdParam 
    }),

    findMessageById: z.object({
        params: idParam
    }),

    delete: z.object({
        params: idParam
    })
};

export { messagesSchema };