import { z } from "zod";

const params = z.object({ id: z.uuid("ID do vendedor invalido") })

const baseSchema = z.object({
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
});

const reviewSchema = {
  create: z.object({
    body: baseSchema,
  }),
  getBySellerId: z.object({
    params: params
  }),
};

export { reviewSchema };
