import { messagesService } from '../services/messages.service.js';

const messagesController = {
  /**
   * Criação de mensagem (REST)
   */
  createMessage: async (req, res) => {
    try {
      const { sender_id, receiver_id, product_id, message, image_url } =
        req.body;

      const newMessage = await messagesService.createMessage({
        sender_id,
        receiver_id,
        product_id,
        message,
        image_url,
      });

      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro ao criar mensagem',
        details: error.message,
      });
    }
  },

  /**
   * Lista mensagens por usuário
   */
  getMessagesByUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const messages = await messagesService.getMessagesByUser(userId);

      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro ao buscar mensagens',
        details: error.message,
      });
    }
  },

  /**
   * Busca mensagem por ID
   */
  findMessageById: async (req, res) => {
    try {
      const { id } = req.params;

      const message = await messagesService.getMessageById(id);

      res.status(200).json(message);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro ao buscar mensagem',
        details: error.message,
      });
    }
  },

  /**
   * Remove mensagem
   */
  deleteMessageById: async (req, res) => {
    try {
      const { id } = req.params;

      await messagesService.deleteMessageById(id);

      res.status(200).json({
        message: 'Mensagem deletada com sucesso',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro ao deletar mensagem',
        details: error.message,
      });
    }
  },

  /**
   * Marca mensagens como lidas
   */
  markMessagesAsRead: async (req, res) => {
    try {
      const { userId, productId, otherUserId } = req.body;

      await messagesService.markMessagesAsRead(userId, productId, otherUserId);

      res.status(200).json({ message: 'Mensagens marcadas como lidas' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro ao marcar mensagens como lidas',
        details: error.message,
      });
    }
  },

  /**
   * Deleta toda a conversa entre dois usuários sobre um produto
   */
  deleteConversation: async (req, res) => {
    try {
      const { userId, productId, otherUserId } = req.body;

      await messagesService.deleteConversation(userId, productId, otherUserId);

      res.status(200).json({ message: 'Conversa deletada com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro ao deletar conversa',
        details: error.message,
      });
    }
  },
};

export { messagesController };
