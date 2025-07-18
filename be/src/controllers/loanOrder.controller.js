import * as service from '../services/loanOrder.service.js';

/** POST /loans */
export const createLoanOrder = async (req, res, next) => {
  try {
    const loan = await service.createLoanOrder(req.body);
    res.status(201).json(loan);
  } catch (err) {
    next(err);
  }
};

/** GET /loans */
export const getAllLoanOrders = async (req, res, next) => {
  try {
    const loans = await service.getAllLoanOrders();
    res.json(loans);
  } catch (err) {
    next(err);
  }
};

/** GET /loans/:id */
export const getLoanOrderById = async (req, res, next) => {
  try {
    const loan = await service.getLoanOrderById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Not found' });
    res.json(loan);
  } catch (err) {
    next(err);
  }
};

/** PUT /loans/:id */
export const updateLoanOrder = async (req, res, next) => {
  try {
    const loan = await service.updateLoanOrder(req.params.id, req.body);
    if (!loan) return res.status(404).json({ message: 'Not found' });
    res.json(loan);
  } catch (err) {
    next(err);
  }
};

/** DELETE /loans/:id */
export const deleteLoanOrder = async (req, res, next) => {
  try {
    await service.deleteLoanOrder(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/return */
export const returnBook = async (req, res, next) => {
  try {
    const loan = await service.markReturned(req.params.id);
    res.json(loan);
  } catch (err) {
    next(err);
  }
};

/** POST /loans/:id/confirm */
export const confirmLoanOrder = async (req, res, next) => {
  try {
    const loan = await service.confirmLoanOrder(req.params.id);
    res.json(loan);
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
      cooldownUntil ? new Date(cooldownUntil) : null
    );
    res.json(loan);
  } catch (err) {
    next(err);
  }
};
