import supabase from "../supabase.js";
import { createNotificationSchema } from "../schemas/notification.schema.js";

export async function createNotification(data) {
  const parsed = createNotificationSchema.parse(data);

  const { data: notification, error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: parsed.userId,
        type: parsed.type,
        title: parsed.title,
        content: parsed.content,
        link: parsed.link ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return notification;
}

export async function getUserNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function markAsRead(notificationId, userId) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw error;
}
