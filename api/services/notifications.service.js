import supabase from "../supabase.js";
import { appError } from "../utils/appError.utils.js";

const notificationsService = {

createNotification: async (body) => {

  const { userId, type, title, content, link } = body;

  const notificationData = {
    user_id: userId,
    type: type,
    title: title,
    content: content,
    link: link ?? null,
  };

  const { data: notification, error } = await supabase
    .from("notifications")
    .insert([
      notificationData,
    ])
    .select()
    .single();

  if (error) throw new appError("Erro ao criar notificação:" + error.message);
  
  return notification;
},

getUserNotifications: async (userId) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new appError(error.message);
  return data;
},

markAsRead: async (notificationId, userId) => {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw new appError(error.message);
}

};


export { notificationsService };