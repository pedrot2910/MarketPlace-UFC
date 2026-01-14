import { Router } from 'express';
import { messagesController } from '../controllers/messages.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { messagesSchema } from '../schemas/messages.schema.js';

const messagesRoutes = Router();

messagesRoutes.post(
  '/',
  authMiddleware,
  validateSchema(messagesSchema.create),
  messagesController.createMessage,
);

messagesRoutes.get(
  '/user/:userId',
  authMiddleware,
  validateSchema(messagesSchema.getMessagesByUser),
  messagesController.getMessagesByUser,
);

messagesRoutes.put(
  '/mark-read',
  authMiddleware,
  messagesController.markMessagesAsRead,
);

messagesRoutes.delete(
  '/conversation',
  authMiddleware,
  messagesController.deleteConversation,
);

messagesRoutes.get(
  '/:id',
  authMiddleware,
  validateSchema(messagesSchema.findMessageById),
  messagesController.findMessageById,
);
messagesRoutes.delete(
  '/:id',
  authMiddleware,
  validateSchema(messagesSchema.delete),
  messagesController.deleteMessageById,
);

export { messagesRoutes };
