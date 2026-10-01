import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import { joinGroupDeal } from '../services/group.service.js';
import { emitToUser, emitToAdmin } from '../services/socket.service.js';

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'RAZORPAY', customItems, customPricing } = req.body;

    let items = [];
    let pricing = {};
    let appliedCoupon = '';

    if (customItems && customItems.length > 0) {
      // Direct checkout for "Join Group" or "Buy Now"
      items = customItems;
      pricing = customPricing;
    } else {
      // Checkout from Cart
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Your cart is empty' });
      }

      items = cart.items.map(item => ({
        product: item.product._id,
        title: item.product.title,
        image: item.product.images[0],
        price: item.unitPrice,
        mrp: item.product.mrp,
        quantity: item.quantity,
        isGroupBuy: item.isGroupBuy,
        groupDeal: item.groupDeal
      }));

      pricing = {
        subtotal: cart.subtotal,
        groupSavings: cart.groupSavings,
        couponDiscount: cart.couponDiscount,
        deliveryFee: cart.deliveryFee,
        tax: cart.tax,
        total: cart.total
      };

      appliedCoupon = cart.appliedCoupon?.code || '';
    }

    const orderNumber = 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.floor(1000 + Math.random() * 9000);

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        transactionId: 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'SUCCESS',
        paidAt: new Date()
      },
      pricing,
      appliedCoupon,
      status: 'CONFIRMED',
      trackingHistory: [
        { status: 'PLACED', message: 'Order received and logged.', timestamp: new Date() },
        { status: 'CONFIRMED', message: 'Payment verified successfully. Preparing your items.', timestamp: new Date() }
      ]
    });

    // Handle group deal association if applicable
    for (const item of items) {
      if (item.isGroupBuy && item.groupDeal) {
        try {
          await joinGroupDeal({
            groupDealId: item.groupDeal,
            user: req.user,
            quantity: item.quantity,
            orderId: order._id
          });
        } catch (e) {
          console.warn('Group buy join during checkout note:', e.message);
        }
      }

      // Deduct stock
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Clear cart if ordered from cart
    if (!customItems) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], appliedCoupon: { code: '', discountAmount: 0 } });
    }

    // Send confirmation notification
    const notif = await Notification.create({
      user: req.user._id,
      title: '📦 Order Confirmed!',
      message: `Your order #${order.orderNumber} for ₹${order.pricing.total.toLocaleString('en-IN')} has been placed successfully.`,
      type: 'ORDER_UPDATE',
      link: `/orders/${order._id}`
    });
    emitToUser(req.user._id.toString(), 'notification:new', notif);

    // Notify admin
    emitToAdmin('order:new', {
      orderNumber: order.orderNumber,
      total: order.pricing.total,
      customer: req.user.name
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Check ownership or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order with status ${order.status}` });
    }

    order.status = 'CANCELLED';
    order.paymentInfo.status = 'REFUNDED';
    order.trackingHistory.push({
      status: 'CANCELLED',
      message: 'Order cancelled by customer. Refund initiated.',
      timestamp: new Date()
    });

    await order.save();

    // Restock items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    next(error);
  }
};
