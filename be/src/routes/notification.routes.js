// routes/notifications.route.js
import { Router } from 'express';
import {
  markReadController,
  markAllReadController,
  listMyNotifications,
} from '../controllers/notifications.controller.js';

// (tuỳ) middleware bảo vệ
// import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/', listMyNotifications);

// Đánh dấu 1 thông báo đã đọc
// PATCH /notifications/:id/read
router.patch('/read', /* requireAuth, */ markReadController);

// Đánh dấu tất cả trước mốc thời gian là đã đọc
// PATCH /notifications/read-all?before=2025-08-20T00:00:00.000Z
router.patch('/read-all', /* requireAuth, */ markAllReadController);

export default router;
