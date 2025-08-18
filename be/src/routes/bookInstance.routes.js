import express from 'express';
import * as bookInstanceController from '../controllers/bookInstance.controller.js';

const router = express.Router();

router.post('/', bookInstanceController.create);
router.get('/', bookInstanceController.getAll);
router.get('/available-instance', bookInstanceController.getAvailableByBook);
router.get('/:id', bookInstanceController.getById);
router.patch('/', bookInstanceController.update);
router.patch('/delete', bookInstanceController.remove);

export default router;
