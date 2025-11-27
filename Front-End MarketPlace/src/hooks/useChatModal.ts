import { create } from "zustand";

interface ChatModalStore {
  open: boolean;
  threadId: string | null;
  openWithThread: (data: { buyerId: number; sellerId: number; productId: string }) => void;
  close: () => void;
}

export const useChatModal = create<ChatModalStore>((set) => ({
  open: false,
  threadId: null,

  openWithThread: ({ buyerId, sellerId, productId }) => {
    const { getOrCreateThread } = require("../services/chatservice");
    const thread = getOrCreateThread(buyerId, sellerId, productId);

    set({
      open: true,
      threadId: thread.id,
    });
  },

  close: () => set({ open: false, threadId: null }),
}));
