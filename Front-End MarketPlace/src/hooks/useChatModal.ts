import { create } from "zustand";

interface ChatModalStore {
  open: boolean;

  /**
   * Usuário com quem estou conversando
   */
  receiverId: string | number | null;

  /**
   * Produto relacionado ao chat
   */
  productId: string | number | null;

  /**
   * Abre o modal diretamente
   */

  /**
   * Abre o modal já com contexto do chat
   */
  openChat: (data: {
    receiverId: string | number;
    productId: string | number;
  }) => void;

  /**
   * Fecha o modal e limpa estado
   */
  close: () => void;
}

export function getOtherUser(messages: any[], myId: string) {
  for (const msg of messages) {
    if (msg.sender?.id && msg.sender.id !== myId) return msg.sender;
    if (msg.receiver?.id && msg.receiver.id !== myId) return msg.receiver;
  }
  return null;
}

export const useChatModal = create<ChatModalStore>((set) => ({
  open: false,
  receiverId: null,
  productId: null,

  openChat: ({ receiverId, productId }) =>
    set({
      open: true,
      receiverId,
      productId,
    }),

  close: () =>
    set({
      open: false,
      receiverId: null,
      productId: null,
    }),
}));
