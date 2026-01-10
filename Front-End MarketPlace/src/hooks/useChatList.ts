import { chatService } from "../services/chatservice";
import type { ChatThread } from "../services/chatservice";

export function useChatList(currentUserId: number) {
  function getChats(): ChatThread[] {
    return chatService.listUserChats(currentUserId);
  }

  function openChat(otherUserId: number, productId: number): ChatThread {
    // cria a thread se não existir
    // Supondo que currentUserId é o comprador e otherUserId é o vendedor
    return chatService.getOrCreateThread(currentUserId, otherUserId, productId);
  }

  return { getChats, openChat };
}
