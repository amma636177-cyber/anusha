import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'APPROVED' }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      title,
      comment,
      isVerifiedPurchase: true
    });

    // Update product rating average
    const allReviews = await Review.find({ product: productId, status: 'APPROVED' });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);
    await Product.findByIdAndUpdate(productId, {
      ratings: Number(avg.toFixed(1)),
      numReviews: allReviews.length
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};
