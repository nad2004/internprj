import express from 'express';
import {
  getCategories,
  getCategory,
  createNewCategory,
  updateCategoryInfo,
  deleteCategoryBySlug,
} from '../controllers/category.controller.js';

const router = express.Router();
router.get('/', getCategories);
router.get('/:slug', getCategory);
router.post('/', createNewCategory);
router.put('/:slug', updateCategoryInfo);
// Xoá category
router.delete('/:slug', deleteCategoryBySlug);

export default router;
