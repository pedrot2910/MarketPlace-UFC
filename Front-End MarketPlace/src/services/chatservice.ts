import { io, Socket } from "socket.io-client";
import type { Message } from "../types/message";
import type { AppNotification } from "../types/notification";

let socket: Socket | null = null;

type MessageListener = (msg: Message) => void;

export const chatService = {
  connect(token: string) {
    if (socket) return;

    console.log("🧪 TOKEN FRONTEND:", token?.slice(0, 30));

    socket = io(import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000", {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("🟢 SOCKET CONECTADO:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("🔴 SOCKET ERROR:", err.message);
    });

    socket.on("chat-error", (err) => {
      console.error("🔴 CHAT ERROR:", err);
    });

    socket.on("joined-chat", (data) => {
      console.log("🟢 ENTROU NA SALA:", data);
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

  onNotification(callback: (n: AppNotification) => void) {
  socket?.on("notification", callback);
},

offNotification(callback: any) {
  socket?.off("notification", callback);
},
};
