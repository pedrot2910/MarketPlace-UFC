import { Router } from "express";
import { notificationsController } from "../controllers/notifications.controller.js";
import { notificationsSchema } from "../schemas/notification.schema.js";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware,  notificationsController.getMyNotifications);
router.patch("/:id/read", authMiddleware, validateSchema(notificationsSchema.markAsRead), notificationsController.markNotificationAsRead);

export default router;
