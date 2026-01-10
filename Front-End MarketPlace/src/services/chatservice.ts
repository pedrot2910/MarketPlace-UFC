import { io, Socket } from "socket.io-client";
import type { Message } from "../types/message";

let socket: Socket | null = null;

type MessageListener = (msg: Message) => void;

export const chatService = {
  connect(token: string) {
    if (socket) return;

    socket = io(import.meta.env.VITE_API_URL ?? "http://localhost:3333", {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("Socket conectado:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket desconectado");
    });
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },

  /**
   * Entrar na sala
   */
  joinChat(payload: {
    sender_id: string | number;
    receiver_id: string | number;
    product_id: string | number;
  }) {
    socket?.emit("join-chat", payload);
  },

  /**
   * Enviar mensagem
   */
  sendMessage(payload: {
    receiver_id: string | number;
    product_id: string | number;
    message: string;
    image_url?: string;
  }) {
    socket?.emit("send-message", payload);
  },

  /**
   * Receber mensagens
   */
  onMessage(callback: MessageListener) {
    socket?.on("new-message", callback);
  },

  offMessage(callback: MessageListener) {
    socket?.off("new-message", callback);
  },
};
