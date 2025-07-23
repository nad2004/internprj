import express from 'express';
import * as bookInstanceController from '../controllers/bookInstance.controller.js';

const router = express.Router();

router.post('/', bookInstanceController.create);
router.get('/', bookInstanceController.getAll);
router.get('/:id', bookInstanceController.getById);
router.put('/:id', bookInstanceController.update);
router.delete('/:id', bookInstanceController.remove);

export default router;
