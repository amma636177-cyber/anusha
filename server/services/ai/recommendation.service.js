import Product from '../../models/Product.js';
import GroupDeal from '../../models/GroupDeal.js';
import Order from '../../models/Order.js';

export const getPersonalizedRecommendations = async ({ userId, categoryPreference }) => {
  let userCategories = [];

  if (userId) {
    const pastOrders = await Order.find({ user: userId }).limit(5).lean();
    for (const order of pastOrders) {
      for (const item of order.items || []) {
        if (item.product?.categoryName) userCategories.push(item.product.categoryName);
      }
    }
  }

  if (categoryPreference && !userCategories.includes(categoryPreference)) {
    userCategories.unshift(categoryPreference);
  }

  const query = {};
  if (userCategories.length > 0) {
    query.categoryName = { $in: userCategories };
  }

  let products = await Product.find(query).sort({ ratings: -1, activeGroupsCount: -1 }).limit(6).lean();

  if (products.length < 4) {
    products = await Product.find().sort({ ratings: -1 }).limit(6).lean();
  }

  return products.map(prod => {
    const lowestTierPrice = prod.defaultPriceTiers?.length
      ? Math.min(...prod.defaultPriceTiers.map(t => t.price))
      : prod.price;
    const savings = prod.price - lowestTierPrice;

    return {
      ...prod,
      groupPrice: lowestTierPrice,
      savings,
      aiReason: savings > 500
        ? `🔥 Top Group Deal: Save ₹${savings.toLocaleString('en-IN')} with active community buyers`
        : `✨ Recommended based on high customer satisfaction (⭐ ${prod.ratings})`
    };
  });
};

export const getActiveGroupsForProduct = async (productId) => {
  const groups = await GroupDeal.find({
    product: productId,
    status: { $in: ['ACTIVE', 'ALMOST_FULL'] }
  })
    .sort({ currentMembers: -1 })
    .lean();

  return groups.map(g => {
    const spotsLeft = g.maxMembers - g.currentMembers;
    return {
      id: g._id,
      shareCode: g.shareCode,
      creatorName: g.creatorName,
      currentMembers: g.currentMembers,
      maxMembers: g.maxMembers,
      currentPrice: g.currentPrice,
      targetPrice: g.targetPrice,
      spotsLeft,
      urgencyLabel: spotsLeft <= 2 ? '⚡ Almost Full - Only 2 spots left!' : `${spotsLeft} spots available`,
      endTime: g.endTime
    };
  });
};

export const getCartAiInsights = async ({ cart, userId }) => {
  const insights = [];

  if (!cart || !cart.items || cart.items.length === 0) {
    return insights;
  }

  // Check if any individual item in cart has an active group deal
  for (const item of cart.items) {
    if (!item.isGroupBuy) {
      const activeGroup = await GroupDeal.findOne({
        product: item.product,
        status: { $in: ['ACTIVE', 'ALMOST_FULL'] }
      }).lean();

      if (activeGroup) {
        const potentialSavings = (item.unitPrice - activeGroup.currentPrice) * item.quantity;
        if (potentialSavings > 0) {
          insights.push({
            type: 'GROUP_AVAILABLE',
            title: '💡 Group Buy Available',
            message: `You can switch "${item.product?.title || 'this item'}" to an active Group Deal and save ₹${potentialSavings.toLocaleString('en-IN')} immediately!`,
            groupId: activeGroup._id,
            action: 'JOIN_GROUP_FOR_ITEM'
          });
        }
      }
    } else if (item.groupDeal) {
      const group = await GroupDeal.findById(item.groupDeal).lean();
      if (group && group.priceTiers?.length) {
        // Find next tier
        const nextTier = group.priceTiers
          .filter(t => t.memberCount > group.currentMembers)
          .sort((a, b) => a.memberCount - b.memberCount)[0];

        if (nextTier) {
          const needed = nextTier.memberCount - group.currentMembers;
          const drop = group.currentPrice - nextTier.price;
          insights.push({
            type: 'TIER_THRESHOLD',
            title: '🚀 Next Price Tier Near',
            message: `Only ${needed} more ${needed === 1 ? 'person' : 'people'} needed in your group to drop the price by ₹${drop.toLocaleString('en-IN')}! Invite a friend on WhatsApp.`,
            groupId: group._id,
            action: 'SHARE_GROUP'
          });
        }
      }
    }
  }

  // Order value threshold discount suggestion
  if (cart.subtotal < 2000) {
    const diff = 2000 - cart.subtotal;
    insights.push({
      type: 'DISCOUNT_UNLOCK',
      title: '🎁 Unlock ₹300 OFF',
      message: `Add ₹${diff.toLocaleString('en-IN')} more to your cart to unlock the "SUPER2000" instant discount coupon at checkout.`,
      action: 'EXPLORE_MORE'
    });
  }

  return insights;
};
