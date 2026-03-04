import { messagesService } from '../services/messages.service.js';

const messagesController = {
  /**
   * Criação de mensagem (REST)
   */
  createMessage: async (req, res, next) => {
    try {

      const newMessage = await messagesService.createMessage(req.body, req.user.id);

      res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Lista mensagens por usuário
   */
  getMessagesByUser: async (req, res, next) => {
    try {

      const messages = await messagesService.getMessagesByUser(req.user.id);

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Busca mensagem por ID
   */
  findMessageById: async (req, res, next) => {
    try {

      const message = await messagesService.getMessageById(req.params);

      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove mensagem
   */
  deleteMessageById: async (req, res, next) => {
    try {

      await messagesService.deleteMessageById( req.params);

      res.status(200).json({
        message: 'Mensagem deletada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Marca mensagens como lidas
   */
  markMessagesAsRead: async (req, res, next) => {
    try {

      await messagesService.markMessagesAsRead(req.body);

      res.status(200).json({ message: 'Mensagens marcadas como lidas' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Deleta toda a conversa entre dois usuários sobre um produto
   */
  deleteConversation: async (req, res, next) => {
    try {
      const { productId, otherUserId } = req.body;

      await messagesService.deleteConversation(req.body, req.user.id);

      res.status(200).json({ message: 'Conversa deletada com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

export { messagesController };
