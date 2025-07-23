import express from 'express';
import * as reservationController from '../controllers/reservation.controller.js';

const router = express.Router();

router.post('/', reservationController.create);
router.get('/', reservationController.getAll);
router.get('/:id', reservationController.getById);
router.put('/:id', reservationController.update);
router.delete('/:id', reservationController.remove);

export default router;
