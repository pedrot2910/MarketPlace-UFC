import { messagesService } from "../services/messages.service.js";
import { messagesSchema } from "../schemas/messages.schema.js";

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
         const sender_id = socket.user.id;
          const {
            receiver_id,
            product_id,
            message,
            image_url,
        } = payload;
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

      } catch (error) {
        console.error("Erro ao processar mensagem:", error.message);
        socket.emit("chat-error", "Erro interno ao enviar mensagem");
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  });
}
