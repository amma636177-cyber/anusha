import express from 'express';
import { getDiscountRules, createDiscountRule, updateDiscountRule, deleteDiscountRule, testEvaluateRule } from '../controllers/discount.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/rules', protect, authorize('admin', 'super_admin', 'manager'), getDiscountRules);
router.post('/rules', protect, authorize('admin', 'super_admin', 'manager'), createDiscountRule);
router.put('/rules/:id', protect, authorize('admin', 'super_admin', 'manager'), updateDiscountRule);
router.delete('/rules/:id', protect, authorize('admin', 'super_admin'), deleteDiscountRule);
router.post('/evaluate', testEvaluateRule);

export default router;
