import { messagesService } from "../services/messages.service.js";
import { messagesSchema } from "../schemas/messages.schema.js";
import { notificationsService } from "../services/notifications.service.js";

/**
 * Gera um ID determinístico de sala para garantir
 * que dois usuários sempre entrem na mesma conversa.
 */
function buildRoomId({ senderId, receiverId, productId }) {
  const users = [senderId, receiverId].sort();
  return `chat:${users[0]}-${users[1]}:${productId}`;
}

const chatSocket = {
  RegisterChatSocket: async (io) => {
    console.log("ChatS Registrado");

    io.on("connection", (socket) => {
      console.log("Usuario Conectado:", socket.id);
      if (socket.data.user?.id) {
        const userRoom = `user:${socket.data.user.id}`;
        socket.join(userRoom);
        console.log("✅ Socket entrou na sala pessoal:", userRoom);
      } else {
        console.log("❌ Socket conectado sem usuário autenticado");
      }

      socket.on("join-chat", ({ sender_id, receiver_id, product_id }) => {
        const roomId = buildRoomId({
          senderId: sender_id,
          receiverId: receiver_id,
          productId: product_id,
        });

        socket.join(roomId);

        socket.emit("joined-chat", { roomId });
        console.log(`Socket ${socket.id} entrou na sala ${roomId}`);

        socket.on("send-message", async (payload) => {
          try {
            console.log("🧪 SOCKET USER:", socket.user);
            console.log("🧪 SOCKET DATA:", socket.data);
            if (!socket.data.user) {
              return socket.emit(
                "chat-error",
                "Usuário não autenticado no socket.",
              );
            }
            const sender_id = socket.data.user.id;

            const { receiver_id, product_id, message, image_url } = payload;
            // Validação usando o mesmo schema do REST
            // OBS: Poderíamos criar um schema específico para o socket, mas para evitar duplicação, vamos usar o mesmo do REST
            // A única diferença é que o sender_id vem do socket.data.user.id, garantindo que o usuário autenticado seja sempre o remetente
            // Isso evita que um usuário malicioso tente se passar por outro enviando um sender_id diferente no payload;
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
            const savedMessage = await messagesService.createMessage(
              {
                receiver_id,
                product_id,
                message,
                image_url,
              },
              sender_id,
            );
            // Broadcast para todos da sala
            io.to(roomId).emit("new-message", savedMessage);
            console.log("📩 Criando notificação para:", receiver_id);
            const notification = await notificationsService.createNotification({
              userId: receiver_id,
              type: "message",
              title: "Nova mensagem",
              content:
                message.length > 100
                  ? message.substring(0, 100) + "..."
                  : message,
              link: `/chat?user=${sender_id}&product=${product_id}`,
            });

            console.log("✅ Notificação criada:", notification.id);

            io.to(`user:${receiver_id}`).emit("new-notification", notification);
          } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            socket.emit("chat-error", "Erro ao enviar mensagem.");
          }
        });
      });
    });
  },
};

export { chatSocket };
