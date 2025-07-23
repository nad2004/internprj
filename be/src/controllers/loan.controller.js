import * as service from '../services/loan.service.js';
import { respondSuccess } from '../utils/respond.js';
/** POST /loans */
export const createLoan = async (req, res, next) => {
  try {
    const loan = await service.createLoan(req.body);
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** GET /loans */
export const getAllLoans = async (req, res, next) => {
  try {
    const loans = await service.getAllLoans();
    respondSuccess(res, { data: loans });
  } catch (err) {
    next(err);
  }
};

/** GET /loans/:id */
export const getLoanById = async (req, res, next) => {
  try {
    const loan = await service.getLoanById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Not found' });
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** PUT /loans/:id */
export const updateLoan = async (req, res, next) => {
  try {
    const loan = await service.updateLoan(req.params.id, req.body);
    if (!loan) return res.status(404).json({ message: 'Not found' });
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** DELETE /loans/:id */
export const deleteLoan = async (req, res, next) => {
  try {
    await service.deleteLoan(req.params.id);
    respondSuccess(res, { message: 'Loan deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/return */
export const returnBook = async (req, res, next) => {
  try {
    const loan = await service.markReturned(req.params.id);
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/confirm */
export const confirmLoan = async (req, res, next) => {
  try {
    const loan = await service.confirmLoan(req.params.id);
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/start-cooldown */
export const startCooldown = async (req, res, next) => {
  try {
    const { cooldownUntil } = req.body;
    const loan = await service.startCooldown(
      req.params.id,
      cooldownUntil ? new Date(cooldownUntil) : null,
    );
    respondSuccess(res, { data: loan });
  } catch (err) {
    next(err);
  }
};
