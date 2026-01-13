import { create } from "zustand";

type InboxState = {
  open: boolean;
  openInbox: () => void;
  closeInbox: () => void;
};

export const useInboxModal = create<InboxState>((set) => ({
  open: false,
  openInbox: () => set({ open: true }),
  closeInbox: () => set({ open: false }),
}));
