import { create } from "zustand";
import { chatService } from "../services/chatservice";  // ← IMPORTE AQUI

interface ChatModalStore {
  open: boolean;
  openModal: () => void;
  threadId: string | null;
  openWithThread: (data: { buyerId: number; sellerId: number; productId: number }) => void;
  close: () => void;
}

export const useChatModal = create<ChatModalStore>((set) => ({
  open: false,
  threadId: null,

  openModal: () =>
    set({
      open: true,
      threadId: null,
    }),

  openWithThread: ({ buyerId, sellerId, productId }) => {

    const thread = chatService.getOrCreateThread(buyerId, sellerId, productId);

    set({
      open: true,
      threadId: thread.id,
    });
  },

  close: () => set({ open: false, threadId: null }),
}));
