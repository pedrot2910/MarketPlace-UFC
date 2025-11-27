import { useState } from "react";
import { chatService, type Message } from "../services/chatservice";

export function useChat(currentUserId: number, otherUserId: number) {
  const [messages, setMessages] = useState<Message[]>(
    chatService.getThread(currentUserId, otherUserId).messages
  );

  const send = (text: string) => {
    chatService.sendMessage(currentUserId, otherUserId, text);
    setMessages([...chatService.getThread(currentUserId, otherUserId).messages]);
  };

  const reload = () => {
    setMessages(chatService.getThread(currentUserId, otherUserId).messages);
  };

  return { messages, send, reload };
}
