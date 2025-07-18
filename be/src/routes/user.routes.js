// src/routes/user.routes.js
import express from 'express';
import {
  getUsers,
  getUser,
  updateUserInfo,
  deleteUserById
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUserInfo);
router.delete('/:id', deleteUserById);

export default router;
