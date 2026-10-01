import express from 'express';
import { getCart, addToCart, updateItemQuantity, removeFromCart, applyCouponToCart, clearCart } from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:itemId', updateItemQuantity);
router.delete('/item/:itemId', removeFromCart);
router.post('/coupon', applyCouponToCart);
router.delete('/clear', clearCart);

export default router;
