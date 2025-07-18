import express from 'express';
import {
  getCategories,
  getCategory,
  createNewCategory,
  updateCategoryInfo,
  deleteCategoryBySlug
} from '../controllers/category.controller.js';

const router = express.Router();

// Lấy danh sách category
router.get('/', getCategories);
// Lấy chi tiết 1 category
router.get('/:slug', getCategory);
// Tạo mới category
router.post('/', createNewCategory);
// Cập nhật category
router.put('/:slug', updateCategoryInfo);
// Xoá category
router.delete('/:slug', deleteCategoryBySlug);

export default router;
