import { z } from 'zod';

const validateSchema = (schema) => (req, res, next) => {
  try {
    // Validamos body, query e params juntos
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Atualizamos o req com os dados validados/transformados
    req.body = result.body;
    req.query = result.query;
    req.params = result.params;

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Erro de validação',
        details: error.errors.map((err) => ({
          field: err.path.join('.'), // ex: "body.email" ou "query.page"
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

export { validateSchema };
