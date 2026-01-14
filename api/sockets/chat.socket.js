import { messagesService } from "../services/messages.service.js";
import { messagesSchema } from "../schemas/messages.schema.js";
import { createNotification } from "../services/notifications.service.js";

/**
 * Gera um ID determinístico de sala para garantir
 * que dois usuários sempre entrem na mesma conversa.
 */
function buildRoomId({ senderId, receiverId, productId }) {
  const users = [senderId, receiverId].sort();
  return `chat:${users[0]}-${users[1]}:${productId}`;
}

export function RegisterChatSocket(io) {
  console.log("Chat socket registrado");

  io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    // ============================
    // Entrar na sala do chat
    // ============================
    socket.on("join-chat", ({ sender_id, receiver_id, product_id }) => {
      const roomId = buildRoomId({
        senderId: sender_id,
        receiverId: receiver_id,
        productId: product_id,
      });

      socket.join(roomId);

      socket.emit("joined-chat", { roomId });
      console.log(`Socket ${socket.id} entrou na sala ${roomId}`);
    });

    // ============================
    // Enviar mensagem
    // ============================
    socket.on("send-message", async (payload) => {
      try {
        console.log("🧪 SOCKET USER:", socket.user);
        console.log("🧪 SOCKET DATA:", socket.data);

        if (!socket.data.user) {
          return socket.emit(
            "chat-error",
            "Usuário não autenticado no socket."
          );
        }

        const sender_id = socket.data.user.id;

        const { receiver_id, product_id, message, image_url } = payload;
        // Validação usando o mesmo schema do REST
        const parsed = messagesSchema.create.safeParse({
          body: {
            sender_id,
            receiver_id,
            product_id,
            message,
            image_url,
          },
        });

        if (!parsed.success) {
          return socket.emit("chat-error", parsed.error.format());
        }

        const roomId = buildRoomId({
          senderId: sender_id,
          receiverId: receiver_id,
          productId: product_id,
        });

        // Persistência
        const savedMessage = await messagesService.createMessage({
          sender_id,
          receiver_id,
          product_id,
          message,
          image_url,
        });

        // Broadcast para todos da sala
        io.to(roomId).emit("new-message", savedMessage);

        const notification = await createNotification({
          userId: receiver_id,
          type: "message",
          title: "Nova mensagem",
          content: "Você recebeu uma nova mensagem",
          link: `/chat?user=${sender_id}&product=${product_id}`,
        });

        io.to(`user:${receiver_id}`).emit("new-notification", notification);
      } catch (error) {
        console.error("Erro ao processar mensagem:", error.message);
        socket.emit("chat-error", error.message ?? error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  });
}
