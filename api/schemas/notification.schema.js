import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["message", "purchase", "favorite", "system"]),
  title: z.string().min(1),
  content: z.string().min(1),
  link: z.string().optional(),
});
