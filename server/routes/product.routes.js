import express from 'express';
import { getProducts, getProductByIdOrSlug, getCategories, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductByIdOrSlug);

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin', 'manager'), createProduct);
router.put('/:id', protect, authorize('admin', 'super_admin', 'manager'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteProduct);

export default router;
