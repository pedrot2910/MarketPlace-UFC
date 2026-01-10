import z from "zod";

const baseSchema = z.object({
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),

  email: z
    .string({ required_error: "O email é obrigatório" })
    .email("Formato de email inválido"),

  password: z
    .string({ required_error: "A senha é obrigatória" })
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(100, "A senha deve ter no máximo 100 caracteres"),

  matricula: z
    .string({ required_error: "A matrícula é obrigatória" })
    .min(3, "A matrícula deve ter pelo menos 3 caracteres")
    .max(20, "A matrícula deve ter no máximo 20 caracteres"),

  role: z.enum(["student", "tae", "professor", "employee"], {
    errorMap: () => ({
      message: "Função deve ser: student, tae, professor ou employee",
    }),
  }),
});

const authSchema = {
  signUp: z.object({
    body: baseSchema,
  }),

  signIn: z.object({
    body: baseSchema.pick({ email: true, password: true }),
  }),
};

export { authSchema };
