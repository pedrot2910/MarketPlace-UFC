import { createContext } from "react";
import type { AppNotification } from "../types/notification";

export type NotificationContextType = {
  notifications: AppNotification[];
  unreadCount: number;
  push: (n: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

