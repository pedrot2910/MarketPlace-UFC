import { useState, useEffect } from "react";
import type { AppNotification } from "../types/notification";
import { chatService } from "../services/chatservice";
import { useAuth } from "../hooks/auth/useAuth";
import { NotificationContext } from "../hooks/NotificationContext";

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

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  // 🔔 Listener GLOBAL de notificações
  useEffect(() => {
    if (!user) return;

    function handleNotification(data: AppNotification) {
      push({
        ...data,
        id: crypto.randomUUID(),
        read: false,
        created_at: new Date().toISOString(),
      });
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
