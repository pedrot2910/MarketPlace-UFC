import { useState } from "react";
import { chatService, type Message } from "../services/chatservice";

export function useChat(currentUserId: number, otherUserId: number, productId: number) {
  const thread = chatService.getOrCreateThread(currentUserId, otherUserId, productId);
  const [messages, setMessages] = useState<Message[]>(thread.messages);

  const send = (text: string) => {
    chatService.sendMessage(thread.id, currentUserId, text);
    const updatedThread = chatService.getOrCreateThread(currentUserId, otherUserId, productId);
    setMessages([...updatedThread.messages]);
  };

  const reload = () => {
    const updatedThread = chatService.getOrCreateThread(currentUserId, otherUserId, productId);
    setMessages(updatedThread.messages);
  };

  return { messages, send, reload };
}
