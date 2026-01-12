<<<<<<< HEAD
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100),

  email: z.string().email("Formato de email inválido"),

  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
=======
import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').max(100),

  email: z.string().email('Formato de email inválido'),

  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
>>>>>>> 06e40cb8f4540296c6dceade37f41494aa9a7b72
    .max(100),

  matricula: z.string().min(3).max(20),

<<<<<<< HEAD
  role: z.enum(["student", "tae", "professor", "employee"]),
});

const signInSchema = z.object({
  email: z.string().email("Formato de email inválido"),

  password: z.string().min(1, "Senha obrigatória"),
=======
  role: z.enum(['student', 'tae', 'professor', 'employee']),
});

const signInSchema = z.object({
  email: z.string().email('Formato de email inválido'),

  password: z.string().min(1, 'Senha obrigatória'),
>>>>>>> 06e40cb8f4540296c6dceade37f41494aa9a7b72
});

export const authSchema = {
  signUp: z.object({
    body: signUpSchema,
  }),

  signIn: z.object({
    body: signInSchema,
  }),
};
