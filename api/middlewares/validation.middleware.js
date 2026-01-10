import { z } from "zod";

const validateSchema = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (result.body) req.body = result.body;
    if (result.params) req.params = result.params;

    next();
  } catch (err) {
    // ✅ Tratamento seguro para Zod
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Erro de validação",
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // ✅ Qualquer outro erro real
    console.error("VALIDATION MIDDLEWARE ERROR:", err);
    return res.status(500).json({
      error: "Erro interno na validação",
    });
  }
};

export { validateSchema };
