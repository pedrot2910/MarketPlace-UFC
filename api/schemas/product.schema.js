import { z } from 'zod';

const params = z.object({ id: z.string().uuid('ID do produto inválido') });

const proximityParams = z.object({
  lat: z.coerce.number({
        required_error: 'A latitude é obrigatória',
      }).optional(),
      lng: z.coerce.number({
        required_error: 'A longitude é obrigatória',
      }).optional(),
      radius: z.coerce.number({
        required_error: 'O raio é obrigatório',
      }).min(1, 'O raio deve ser pelo menos 1 km').optional(),
    });

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

  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),

  product_images: z
  .array(z.string().url('URL de imagem inválida'))
  .min(1, 'Pelo menos uma imagem é obrigatória'),

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
  getAllProducts: z.object({
   query: proximityParams.extend({
    search: z.string().optional(),
    categoryId: params.shape.id.optional(),
  }),
  }),

};

export { productSchema };