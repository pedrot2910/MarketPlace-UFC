import { Router } from "express";
import * as controller from "../controllers/notifications.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, controller.getMyNotifications);
router.patch("/:id/read", authMiddleware, controller.markNotificationAsRead);

export default router;
