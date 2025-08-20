// controllers/notifications.controller.js
import { markRead, markAllRead, getAllNotifyByUser  } from '../services/notification.service.js';

function parseBefore(str) {
  if (!str) return new Date();
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export async function markReadController(req, res, next) {
  try {
    const { id } = req.body;
    const userId =
      req.user?.id || req.user?._id?.toString() || req.body?.userId;

    if (!id) return res.status(400).json({ message: 'Missing notification id' });
    if (!userId) return res.status(401).json({ message: 'Unauthenticated' });

    const doc = await markRead({ id, userId });
    if (!doc) return res.status(404).json({ message: 'Notification not found' });

    return res.json(doc); // có thể là doc với readAt mới
  } catch (err) {
    next(err);
  }
}

export async function markAllReadController(req, res, next) {
  try {
    const userId =
      req.user?.id || req.user?._id?.toString() || req.body?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthenticated' });

    const before = parseBefore(req.query.before);
    if (!before) return res.status(400).json({ message: 'Invalid "before" date' });

    await markAllRead({ userId, before });

    // 204: đã xử lý, không trả body
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}
export async function listMyNotifications(req, res, next) {
  try {
    const userId = req.query.userId;
    const result = await getAllNotifyByUser({ userId });
    res.json(result);
  } catch (e) { next(e); }
}