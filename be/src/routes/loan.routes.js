import express from 'express';
import * as loanController from '../controllers/loan.controller.js';

const router = express.Router();
router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', loanController.createLoan);
router.put('/:id', loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);
router.post('/return', loanController.markAsReturned);
router.post('/next', loanController.nextAction);
router.post('/reject', loanController.rejectLoan);
router.post('/:id/start-cooldown', loanController.startCooldown);

export default router;
