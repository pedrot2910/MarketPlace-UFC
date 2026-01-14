import { useState, useEffect } from "react";
import type { AppNotification } from "../types/notification";
import { chatService } from "../services/chatservice";
import { useAuth } from "../hooks/auth/useAuth";
import { NotificationContext } from "../hooks/NotificationContext";
import api from "../services/api";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { user, token } = useAuth();

  function push(notification: AppNotification) {
    setNotifications((prev) => [notification, ...prev]);
  }

  async function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Erro ao marcar notificação como lida", err);
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((n) => !n.read);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    await Promise.all(
      unread.map((n) => api.patch(`/notifications/${n.id}/read`))
    );
  }

  // 🔁 Buscar notificações salvas ao logar
  useEffect(() => {
    if (!user) return;

    api.get("/notifications").then((res) => {
      setNotifications(res.data);
    });
  }, [user]);

  // � Conectar socket ao logar
  useEffect(() => {
    if (!user || !token) return;

    console.log("🔌 CONECTANDO SOCKET PARA NOTIFICAÇÕES");
    chatService.connect(token);

    return () => {
      // Não desconecta aqui pois o chat também usa o socket
    };
  }, [user, token]);

  // �🔔 Listener do socket + Polling
  useEffect(() => {
    if (!user) return;

    function handleNotification(data: AppNotification) {
      console.log("🔔 NOTIFICAÇÃO RECEBIDA VIA SOCKET:", data);
      push(data);
    }

    chatService.onNotification(handleNotification);

    // Polling como fallback para garantir que as notificações sejam atualizadas
    const pollInterval = setInterval(async () => {
      try {
        const res = await api.get("/notifications");
        const serverNotifications = res.data;

        setNotifications((prev) => {
          // Só atualiza se houver novas notificações
          if (serverNotifications.length > prev.length) {
            console.log("🔄 POLLING: Novas notificações detectadas");
            return serverNotifications;
          }
          return prev;
        });
      } catch (err) {
        console.error("Erro ao buscar notificações no polling", err);
      }
    }, 3000); // Verifica a cada 3 segundos

    return () => {
      clearInterval(pollInterval);
      chatService.offNotification(handleNotification);
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        push,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
