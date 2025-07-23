import express from 'express';
import * as categoryController from '../controllers/category.controller.js';

const router = express.Router();
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategory);
router.post('/', categoryController.createNewCategory);
router.put('/:slug', categoryController.updateCategoryInfo);
// Xoá category
router.delete('/:slug', categoryController.deleteCategoryBySlug);

export default router;
