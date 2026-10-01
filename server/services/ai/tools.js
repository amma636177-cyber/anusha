import Product from '../../models/Product.js';
import GroupDeal from '../../models/GroupDeal.js';
import Order from '../../models/Order.js';
import DiscountRule from '../../models/DiscountRule.js';
import Coupon from '../../models/Coupon.js';

export const aiTools = {
  searchProducts: async ({ query, category, maxPrice, minDiscount }) => {
    const filter = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    if (category) {
      filter.categoryName = { $regex: category, $options: 'i' };
    }
    if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }

    const products = await Product.find(filter).limit(6).lean();
    return products.map(p => ({
      id: p._id,
      title: p.title,
      category: p.categoryName,
      brand: p.brand,
      price: p.price,
      mrp: p.mrp,
      savings: p.mrp - p.price,
      ratings: p.ratings,
      defaultPriceTiers: p.defaultPriceTiers,
      images: p.images
    }));
  },

  getProductDetails: async ({ productId }) => {
    const product = await Product.findById(productId).lean();
    if (!product) return { error: 'Product not found' };

    const activeGroups = await GroupDeal.find({
      product: productId,
      status: { $in: ['ACTIVE', 'ALMOST_FULL'] }
    }).limit(3).lean();

    return {
      product,
      activeGroups: activeGroups.map(g => ({
        id: g._id,
        currentMembers: g.currentMembers,
        maxMembers: g.maxMembers,
        currentPrice: g.currentPrice,
        endTime: g.endTime
      }))
    };
  },

  searchGroups: async ({ query, category }) => {
    const filter = { status: { $in: ['ACTIVE', 'ALMOST_FULL'] } };
    if (query) {
      filter.productTitle = { $regex: query, $options: 'i' };
    }
    const groups = await GroupDeal.find(filter).limit(6).lean();
    return groups.map(g => ({
      id: g._id,
      productTitle: g.productTitle,
      productImage: g.productImage,
      individualPrice: g.individualPrice,
      currentPrice: g.currentPrice,
      targetPrice: g.targetPrice,
      currentMembers: g.currentMembers,
      maxMembers: g.maxMembers,
      progressPercent: Math.round((g.currentMembers / g.maxMembers) * 100),
      endTime: g.endTime
    }));
  },

  getActiveGroups: async () => {
    return await GroupDeal.find({ status: { $in: ['ACTIVE', 'ALMOST_FULL'] } })
      .sort({ currentMembers: -1 })
      .limit(8)
      .lean();
  },

  getUserRecommendations: async ({ userId, category }) => {
    const filter = {};
    if (category) {
      filter.categoryName = { $regex: category, $options: 'i' };
    }
    return await Product.find(filter)
      .sort({ ratings: -1, activeGroupsCount: -1 })
      .limit(6)
      .lean();
  },

  getDiscountRules: async () => {
    return await DiscountRule.find({ isActive: true }).lean();
  },

  getCouponInformation: async ({ code }) => {
    if (code) {
      return await Coupon.findOne({ code: code.toUpperCase() }).lean();
    }
    return await Coupon.find({ isActive: true }).limit(5).lean();
  },

  getSalesAnalytics: async () => {
    const totalOrders = await Order.countDocuments();
    const successfulOrders = await Order.find({ 'paymentInfo.status': 'SUCCESS' }).lean();
    const totalRevenue = successfulOrders.reduce((acc, o) => acc + (o.pricing?.total || 0), 0);
    const activeGroupsCount = await GroupDeal.countDocuments({ status: { $in: ['ACTIVE', 'ALMOST_FULL'] } });
    const completedGroupsCount = await GroupDeal.countDocuments({ status: 'COMPLETED' });

    return {
      totalOrders,
      totalRevenue,
      activeGroupsCount,
      completedGroupsCount,
      avgOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0
    };
  },

  getInventoryStatus: async () => {
    const lowStock = await Product.find({ stock: { $lte: 10 } }).select('title stock sku price').limit(10).lean();
    const outOfStock = await Product.find({ stock: 0 }).select('title sku price').lean();
    return { lowStock, outOfStock };
  }
};
