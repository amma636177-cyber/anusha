import express from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

export default router;
