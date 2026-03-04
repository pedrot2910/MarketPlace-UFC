import supabase from '../supabase.js';
import { appError } from '../utils/appError.utils.js';

const messagesService = {
  /**
   * Cria uma nova mensagem
   * Retorna sempre UM objeto (não array).
   */
  createMessage: async (body, sender_id) => {
    
    const { receiver_id, product_id, message, image_url } =
        body;
        
    if (sender_id === receiver_id) {
      throw new appError('Não é permitido enviar mensagens para si mesmo', 400);
    }

    const messageData = {
      sender_id: sender_id,
      receiver_id: receiver_id,
      product_id: product_id,
      message: message,
      image_url: image_url,
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single(); // 👈 padronização

    if (error) throw new appError(error.message);
    return data;
  },

  /**
   * Lista mensagens onde o usuário é remetente ou destinatário
   */
  getMessagesByUser: async (userId) => {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        id,
        message,
        created_at,
        read_at,
        sender:profiles!sender_id (id, name, email),
        receiver:profiles!receiver_id (id, name, email),
        product:products (id, title, product_images(image_url))
      `,
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw new appError(error.message);
    return data;
  },

  /**
   * Busca mensagem por ID
   */
  getMessageById: async (param) => {

    const { id } = param;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new appError(error.message);
    return data;
  },

  /**
   * Remove mensagem
   */
  deleteMessageById: async (param) => {
    const { id } = param;
    const { error } = await supabase.from('messages').delete().eq('id', id);

    if (error) throw new appError(error.message);
    return true;
  },

  /**
   * Marca mensagens como lidas
   */
  markMessagesAsRead: async (body) => {

    const { userId, productId, otherUserId } = body;

    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('receiver_id', userId)
      .eq('sender_id', otherUserId)
      .eq('product_id', productId)
      .is('read_at', null);

    if (error) throw new appError(error.message);
    return true;
  },

  /**
   * Deleta toda a conversa entre dois usuários sobre um produto
   */
  deleteConversation: async (body, userId) => {

    const { productId, otherUserId } = body;
    
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('product_id', productId)
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`,
      );

    if (error) throw new appError(error.message);
    return true;
  },
};

export { messagesService };
