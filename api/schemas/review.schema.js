import { z } from "zod";

export const reviewSchema = {
  create: z.object({
    body: z.object({
      seller_id: z.string().uuid("ID do vendedor inválido"),
      product_id: z.string().uuid("ID do produto inválido").optional(),
      rating: z
        .number()
        .int()
        .min(1)
        .max(5, "A avaliação deve ser entre 1 e 5"),
      comment: z
        .string()
        .max(500, "O comentário deve ter no máximo 500 caracteres")
        .optional(),
    }),
  }),
};
