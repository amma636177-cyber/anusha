import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  getAuditLogs
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin', 'manager'));

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);
router.put('/users/:id/role', authorize('admin', 'super_admin'), updateUserRole);
router.get('/audit-logs', getAuditLogs);

export default router;
