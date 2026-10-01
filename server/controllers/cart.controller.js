import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import GroupDeal from '../models/GroupDeal.js';
import { validateAndApplyCoupon } from '../services/discount.service.js';

const recalculateCart = async (cart) => {
  let subtotal = 0;
  let groupSavings = 0;

  for (const item of cart.items) {
    subtotal += item.unitPrice * item.quantity;
    if (item.isGroupBuy && item.originalPrice > item.unitPrice) {
      groupSavings += (item.originalPrice - item.unitPrice) * item.quantity;
    }
  }

  // Delivery fee: Free above 999, else 99
  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;

  // Coupon discount
  let couponDiscount = 0;
  if (cart.appliedCoupon?.code) {
    const isGroupBuy = cart.items.some(i => i.isGroupBuy);
    const couponResult = await validateAndApplyCoupon({
      code: cart.appliedCoupon.code,
      userId: cart.user,
      subtotal,
      isGroupBuy
    });
    if (couponResult.valid) {
      couponDiscount = couponResult.coupon.discountAmount;
      cart.appliedCoupon.discountAmount = couponDiscount;
    } else {
      cart.appliedCoupon = { code: '', discountAmount: 0 };
    }
  }

  // Tax: 5% GST
  const taxable = Math.max(0, subtotal - couponDiscount);
  const tax = Math.round(taxable * 0.05);
  const total = taxable + deliveryFee + tax;

  cart.subtotal = subtotal;
  cart.groupSavings = groupSavings;
  cart.couponDiscount = couponDiscount;
  cart.deliveryFee = deliveryFee;
  cart.tax = tax;
  cart.total = total;

  await cart.save();
  return cart;
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
      .populate('items.groupDeal');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    } else {
      cart = await recalculateCart(cart);
      cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product')
        .populate('items.groupDeal');
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, groupDealId, quantity = 1, isGroupBuy = false } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let unitPrice = product.price;
    let originalPrice = product.mrp;

    if (isGroupBuy && groupDealId) {
      const group = await GroupDeal.findById(groupDealId);
      if (group) {
        unitPrice = group.currentPrice;
        originalPrice = product.price;
      }
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(i =>
      i.product.toString() === productId.toString() &&
      Boolean(i.isGroupBuy) === Boolean(isGroupBuy) &&
      (groupDealId ? i.groupDeal?.toString() === groupDealId.toString() : true)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        groupDeal: groupDealId || null,
        isGroupBuy: Boolean(isGroupBuy),
        quantity: Number(quantity),
        unitPrice,
        originalPrice
      });
    }

    await recalculateCart(cart);
    const populated = await Cart.findById(cart._id).populate('items.product').populate('items.groupDeal');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = Number(quantity);
    }

    await recalculateCart(cart);
    const populated = await Cart.findById(cart._id).populate('items.product').populate('items.groupDeal');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items.pull(itemId);
    await recalculateCart(cart);
    const populated = await Cart.findById(cart._id).populate('items.product').populate('items.groupDeal');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

export const applyCouponToCart = async (req, res, next) => {
  try {
    const { code } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const isGroupBuy = cart.items.some(i => i.isGroupBuy);
    const result = await validateAndApplyCoupon({
      code,
      userId: req.user._id,
      subtotal: cart.subtotal,
      isGroupBuy
    });

    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    cart.appliedCoupon = {
      code: result.coupon.code,
      discountAmount: result.coupon.discountAmount
    };

    await recalculateCart(cart);
    const populated = await Cart.findById(cart._id).populate('items.product').populate('items.groupDeal');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.appliedCoupon = { code: '', discountAmount: 0 };
      await recalculateCart(cart);
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
