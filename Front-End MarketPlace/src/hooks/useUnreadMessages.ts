import { useState, useEffect } from "react";
import { useAuth } from "./auth/useAuth";
import { getMessagesByUser } from "../services/messages.service";

export function useUnreadMessages() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    async function countUnreadMessages() {
      try {
        const messages = await getMessagesByUser(user!.id);
        
        // Contar mensagens não lidas recebidas pelo usuário atual
        const unread = messages.filter(
          (msg) =>
            msg.receiver?.id === user!.id && !msg.read_at
        ).length;

        setUnreadCount(unread);
      } catch (err) {
        console.error("Erro ao contar mensagens não lidas:", err);
      }
    }

    countUnreadMessages();

    // Polling para atualizar contador em tempo real
    const interval = setInterval(() => {
      countUnreadMessages();
    }, 3000); // Verifica a cada 3 segundos

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  return { unreadCount };
}
