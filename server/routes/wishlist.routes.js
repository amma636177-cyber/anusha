import express from 'express';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getWishlist);
router.post('/toggle', toggleWishlistItem);

export default router;
