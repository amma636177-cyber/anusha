import express from 'express';
import { getCoupons, applyCouponCode, createCoupon, updateCoupon, deleteCoupon } from '../controllers/coupon.controller.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getCoupons);
router.post('/apply', optionalAuth, applyCouponCode);

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin', 'manager'), createCoupon);
router.put('/:id', protect, authorize('admin', 'super_admin', 'manager'), updateCoupon);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteCoupon);

export default router;
