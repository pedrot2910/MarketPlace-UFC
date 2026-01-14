import { io, Socket } from "socket.io-client";
import type { Message } from "../types/message";
import type { AppNotification } from "../types/notification";

let socket: Socket | null = null;

type MessageListener = (msg: Message) => void;
type NotificationListener = (notification: AppNotification) => void;

export const chatService = {
  connect(token: string) {
    if (socket) return;

    socket = io(import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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

    socket?.on("new-notification", (data) => {
    console.log("🔥 FRONT RECEBEU NOTIFICAÇÃO:", data);
  });
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },

  joinChat(payload: {
    sender_id: string;
    receiver_id: string;
    product_id: string;
  }) {
    socket?.emit("join-chat", payload);
  },

  sendMessage(payload: {
    receiver_id: string;
    product_id: string;
    message: string;
    image_url?: string;
  }) {
    socket?.emit("send-message", payload);
  },

  onMessage(callback: MessageListener) {
    socket?.on("new-message", callback);
  },

  offMessage(callback: MessageListener) {
    socket?.off("new-message", callback);
  },

  onNotification(callback: NotificationListener) {
    socket?.on("new-notification", callback);
  },

  offNotification(callback: NotificationListener) {
    socket?.off("new-notification", callback);
  },
};
