import * as loanService from '../services/loan.service.js';
import { respondSuccess } from '../utils/respond.js';
import mongoose from 'mongoose';
/** POST /loans */
function parseDMY(p, label) {
  if (!p || p.d == null || p.m == null || p.y == null) {
    throw new Error(`${label} không hợp lệ`);
  }
  const dd = parseInt(String(p.d), 10);
  const mm = parseInt(String(p.m), 10);
  const yy = parseInt(String(p.y), 10);
  const dt = new Date(Date.UTC(yy, mm - 1, dd, 0, 0, 0, 0));
  if (dt.getUTCFullYear() !== yy || dt.getUTCMonth() + 1 !== mm || dt.getUTCDate() !== dd) {
    throw new Error(`${label} không tồn tại`);
  }
  return dt;
}

export const createLoan = async (req, res, next) => {
  try {
    const body = req.body || {};
    const {
      from,
      to,
      description = '',
      userId: userIdRaw, // ưu tiên từ body
      bookInstanceId: instIdRaw, // nếu có -> ưu tiên dùng
      code: codeRaw, // nếu không có instId -> dùng code
      serial, // alias cho code (nếu client gửi 'serial')
    } = body;

    // Ngày
    const borrowedAt = parseDMY(from, 'Ngày mượn');
    const dueAt = parseDMY(to, 'Ngày trả');
    if (dueAt <= borrowedAt) {
      return res.status(400).json({ success: false, message: 'Ngày trả phải sau ngày mượn' });
    }

    // userId: ưu tiên body, fallback req.user._id
    const userId = (userIdRaw ?? (req.user && req.user._id))?.toString();
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'userId không hợp lệ' });
    }

    // bookInstanceId / code
    const payload = { userId, borrowedAt, dueAt, description };

    if (instIdRaw) {
      const instId = String(instIdRaw).trim();
      if (!mongoose.Types.ObjectId.isValid(instId)) {
        return res.status(400).json({ success: false, message: 'bookInstanceId không hợp lệ' });
      }
      payload.bookInstanceId = instId;
    } else {
      const code = String(codeRaw ?? serial ?? '').trim();
      if (!code) {
        return res.status(400).json({ success: false, message: 'Thiếu bookInstanceId hoặc code' });
      }
      payload.code = code; // nếu DB bạn lưu uppercase thì dùng code.toUpperCase()
    }

    const data = await loanService.createLoan(payload);
    return respondSuccess(res, { data }, 201);
  } catch (err) {
    next(err);
  }
};

/** GET /loans */
export const getAllLoans = async (req, res, next) => {
  try {
    const loans = await loanService.getAllLoans();
    respondSuccess(res, { data: loans });
  } catch (err) {
    next(err);
  }
};

/** GET /loans/:id */
export const getLoanById = async (req, res, next) => {
  try {
    const loan = await loanService.getLoanById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Not found' });
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** PUT /loans/:id */
export const updateLoan = async (req, res, next) => {
  try {
    const loan = await loanService.updateLoan(req.params.id, req.body);
    if (!loan) return res.status(404).json({ message: 'Not found' });
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** DELETE /loans/:id */
export const deleteLoan = async (req, res, next) => {
  try {
    await loanService.deleteLoan(req.params.id);
    respondSuccess(res, { message: 'Loan deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/return */
export const nextAction = async (req, res, next) => {
  try {
    const loan = await loanService.nextStep(req.params.id, {
      cooldownUntil: req.body?.cooldownUntil, // optional
    });
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/return  (đánh dấu trả, reset instance) */
export const markAsReturned = async (req, res, next) => {
  try {
    const loan = await loanService.markReturned(
      req.params.id,
      req.body?.returnedAt ? new Date(req.body.returnedAt) : new Date(),
    );
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/confirm */
export const confirmLoan = async (req, res, next) => {
  try {
    const loan = await loanService.confirmLoan(req.params.id);
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/start-cooldown */
export const startCooldown = async (req, res, next) => {
  try {
    const { cooldownUntil } = req.body;
    const loan = await loanService.startCooldown(
      req.params.id,
      cooldownUntil ? new Date(cooldownUntil) : null,
    );
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};
