import { z } from "zod";


const idParam = z.object({ id: z.string().uuid("ID inválido") });

const notificationsSchema = {
  create: z.object({

    body: z.object({

      userId: z.string().uuid(),
      type: z.enum(["message", "purchase", "favorite", "system", "review"]),
      title: z.string().min(1),
      content: z.string().min(1),
      link: z.string().optional(),

    }),

  }),

  markAsRead: z.object({

    params: idParam,

  }),

}

export { notificationsSchema };