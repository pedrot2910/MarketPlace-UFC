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
  openModal: () => void;

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

export const useChatModal = create<ChatModalStore>((set) => ({
  open: false,
  receiverId: null,
  productId: null,

  openModal: () =>
    set({
      open: true,
    }),

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
