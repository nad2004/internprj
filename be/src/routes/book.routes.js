import express from 'express';
import * as bookController from '../controllers/book.controller.js';

const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/:slug/detail', bookController.getBookDetailWithStatsBySlug);
router.get('/trending', bookController.getBookTrending);
export default router;
