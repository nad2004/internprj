// src/routes/user.routes.js
import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUserInfo);
router.delete('/:id', userController.deleteUserById);

export default router;
