import { z } from 'zod';

const params = z.object({ id: z.string().uuid('ID do produto inválido') });

const baseSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),

  description: z.string().optional(),

  price: z.coerce
    .number({ required_error: 'O preço é obrigatório' })
    .min(0, 'O preço não pode ser negativo'),

  category_id: z
    .string({ required_error: 'A categoria é obrigatória' })
    .uuid('ID da categoria inválido'),

  condition: z.enum(['novo', 'seminovo', 'usado'], {
    errorMap: () => ({ message: 'Condição deve ser: novo, seminovo ou usado' }),
  }),

  type: z.enum(['venda', 'troca'], {
    errorMap: () => ({ message: 'Tipo deve ser: venda ou troca' }),
  }),

  product_images: z.array(z.string().url('URL de imagem inválida')).optional(),
  images_to_remove: z
    .array(z.string().url('URL de imagem inválida'))
    .optional(),
  cover_image_url: z
    .string()
    .url('URL de imagem de capa inválida')
    .nullable()
    .optional(),
});

const productSchema = {
  create: z.object({
    body: baseSchema,
  }),
  update: z.object({
    params: params,
    body: baseSchema.partial(),
  }),
  getProductById: z.object({
    params: params,
  }),
  delete: z.object({
    params: params,
  }),
};

export { productSchema };
