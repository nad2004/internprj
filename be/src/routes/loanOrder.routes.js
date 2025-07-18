// src/modules/loanOrder/loanOrder.routes.js
import express from 'express';
import {
  getAllLoanOrders,
  getLoanOrderById,
  createLoanOrder,
  updateLoanOrder,
  deleteLoanOrder,
  returnBook,
  confirmLoanOrder,
  startCooldown
} from '../controllers/loanOrder.controller.js';

const router = express.Router();
router.get('/', getAllLoanOrders);
router.get('/:id', getLoanOrderById);
router.post('/', createLoanOrder);
router.put('/:id', updateLoanOrder);
router.delete('/:id', deleteLoanOrder);
router.post('/:id/return', returnBook);
router.post('/:id/confirm', confirmLoanOrder);
router.post('/:id/start-cooldown', startCooldown);

export default router;
