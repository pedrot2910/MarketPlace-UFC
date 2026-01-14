export type NotificationType =
  | "message"
  | "purchase"
  | "favorite"
  | "system";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  link?: string | null;
  created_at: string;
  read: boolean;
};
