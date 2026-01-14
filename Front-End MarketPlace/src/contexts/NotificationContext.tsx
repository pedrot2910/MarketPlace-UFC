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
  const { user } = useAuth();

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

  // 🔔 Listener do socket
  useEffect(() => {
    if (!user) return;

    function handleNotification(data: AppNotification) {
      push(data);
    }

    chatService.onNotification(handleNotification);
    return () => chatService.offNotification(handleNotification);
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
