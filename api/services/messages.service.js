import supabase from '../supabase.js';

const messagesService = {
  /**
   * Cria uma nova mensagem
   * Retorna sempre UM objeto (não array).
   */
  createMessage: async (messageData) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single(); // 👈 padronização

    if (error) throw new Error(error.message);
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

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Busca mensagem por ID
   */
  getMessageById: async (id) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Remove mensagem
   */
  deleteMessageById: async (id) => {
    const { error } = await supabase.from('messages').delete().eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Marca mensagens como lidas
   */
  markMessagesAsRead: async (userId, productId, otherUserId) => {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('receiver_id', userId)
      .eq('sender_id', otherUserId)
      .eq('product_id', productId)
      .is('read_at', null);

    if (error) throw new Error(error.message);
    return true;
  },
};

export { messagesService };
