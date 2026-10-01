import express from 'express';
import { getProductReviews, addReview } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, addReview);

export default router;
