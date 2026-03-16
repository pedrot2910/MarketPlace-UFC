import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {

  console.error(err);
  console.log(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    const errorObject = err.errors.map((e) => ({
      titulo: e.path.join("."),
      mensagem: e.message
    }));
    return res.status(400).json({ error: errorObject });
  }

  if (err.code === "23505") {
    const field = err.meta.target[0];
    return res.status(400).json({ error: `O campo ${field} deve ser único.` });
  }

  return res.status(500).json({ error: "Ocorreu um erro inesperado." });
};

export { errorHandler };