import DiscountRule from '../models/DiscountRule.js';
import Coupon from '../models/Coupon.js';

export const calculateGroupTierPrice = (priceTiers, memberCount, fallbackPrice) => {
  if (!priceTiers || priceTiers.length === 0) return fallbackPrice;

  // Sort tiers ascending by memberCount
  const sorted = [...priceTiers].sort((a, b) => a.memberCount - b.memberCount);

  let matchedPrice = fallbackPrice;
  for (const tier of sorted) {
    if (memberCount >= tier.memberCount) {
      matchedPrice = tier.price;
    }
  }
  return matchedPrice;
};

export const evaluateRulesForOrder = async ({ groupMembers = 1, orderValue = 0, categoryIds = [], userType = 'ALL' }) => {
  const activeRules = await DiscountRule.find({ isActive: true }).sort({ priority: -1 });
  let totalRuleDiscount = 0;
  const appliedRules = [];

  for (const rule of activeRules) {
    const { conditions, actions } = rule;
    let satisfies = true;

    if (conditions.minGroupMembers && groupMembers < conditions.minGroupMembers) {
      satisfies = false;
    }

    if (conditions.minOrderValue && orderValue < conditions.minOrderValue) {
      satisfies = false;
    }

    if (conditions.userType && conditions.userType !== 'ALL' && conditions.userType !== userType) {
      satisfies = false;
    }

    if (satisfies) {
      let discountAmount = 0;
      if (actions.discountType === 'PERCENT') {
        discountAmount = Math.round((orderValue * actions.discountValue) / 100);
      } else {
        discountAmount = actions.discountValue;
      }

      if (actions.maxDiscountCap && discountAmount > actions.maxDiscountCap) {
        discountAmount = actions.maxDiscountCap;
      }

      totalRuleDiscount += discountAmount;
      appliedRules.push({
        id: rule._id,
        name: rule.name,
        discountAmount
      });
    }
  }

  return { totalRuleDiscount, appliedRules };
};

export const validateAndApplyCoupon = async ({ code, userId, subtotal, isGroupBuy = false, productIds = [], categoryNames = [] }) => {
  if (!code) return { valid: false, message: 'Coupon code is required' };

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) {
    return { valid: false, message: 'Invalid or inactive coupon code' };
  }

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    return { valid: false, message: 'Coupon campaign has not started yet' };
  }
  if (coupon.endDate && now > coupon.endDate) {
    return { valid: false, message: 'Coupon has expired' };
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: 'Coupon usage limit has been reached' };
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return { valid: false, message: `Minimum order of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for this coupon` };
  }
  if (coupon.isGroupOnly && !isGroupBuy) {
    return { valid: false, message: 'This coupon is exclusively applicable for Group Buy deals' };
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    valid: true,
    coupon: {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount
    }
  };
};
