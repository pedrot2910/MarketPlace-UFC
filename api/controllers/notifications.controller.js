import { notificationsService } from "../services/notifications.service.js";


const notificationsController = {

createNotification: async (req, res) => {
  const notification = await notificationsService.createNotification(req.body);
  res.status(201).json(notification);
},

getMyNotifications: async (req, res) => {
  const data = await notificationsService.getUserNotifications(req.user.id);
  res.json(data);
},

markNotificationAsRead: async (req, res) => {
  await notificationsService.markAsRead(req.params.id, req.user.id);
  res.sendStatus(204);
}

};

export { notificationsController };