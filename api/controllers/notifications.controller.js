import * as service from "../services/notifications.service.js";

export async function getMyNotifications(req, res) {
  const data = await service.getUserNotifications(req.user.id);
  res.json(data);
}

export async function markNotificationAsRead(req, res) {
  await service.markAsRead(req.params.id, req.user.id);
  res.sendStatus(204);
}
