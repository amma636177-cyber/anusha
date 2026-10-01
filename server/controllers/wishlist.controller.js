import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products.product');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlistItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex(p => p.product.toString() === productId.toString());
    let action = 'added';

    if (index > -1) {
      wishlist.products.splice(index, 1);
      action = 'removed';
    } else {
      wishlist.products.push({ product: productId, addedAt: new Date() });
    }

    await wishlist.save();
    const populated = await Wishlist.findById(wishlist._id).populate('products.product');
    res.json({ success: true, action, wishlist: populated });
  } catch (error) {
    next(error);
  }
};
