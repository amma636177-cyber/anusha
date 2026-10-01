import express from 'express';
import {
  handleChat,
  handleSmartSearch,
  getRecommendations,
  getProductGroups,
  getCartInsights,
  generateProductContent,
  generateCoupon,
  getAdminDailyDigest,
  queryAnalytics
} from '../controllers/ai.controller.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', optionalAuth, handleChat);
router.get('/smart-search', handleSmartSearch);
router.get('/recommendations', optionalAuth, getRecommendations);
router.get('/product-groups/:productId', getProductGroups);
router.post('/cart-insights', optionalAuth, getCartInsights);

// Admin AI Endpoints
router.post('/generate-product-content', protect, authorize('admin', 'super_admin', 'manager'), generateProductContent);
router.post('/generate-coupon', protect, authorize('admin', 'super_admin', 'manager'), generateCoupon);
router.get('/admin-digest', protect, authorize('admin', 'super_admin', 'manager'), getAdminDailyDigest);
router.post('/query-analytics', protect, authorize('admin', 'super_admin', 'manager'), queryAnalytics);

export default router;
