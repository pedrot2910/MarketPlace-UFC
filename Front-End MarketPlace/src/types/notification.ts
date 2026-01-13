export type NotificationType =
  | "chat"
  | "order"
  | "review"
  | "system";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;

  // contexto
  userId?: string;
  productId?: string;
  chatUserId?: string;
  orderId?: string;

  payload?: any;
};
