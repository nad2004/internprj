// src/routes/user.routes.js
import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.patch('/', userController.updateUserInfo);
router.patch('/delete', userController.deleteUserById);

export default router;
