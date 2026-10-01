import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import GroupDeal from '../models/GroupDeal.js';
import Coupon from '../models/Coupon.js';
import AuditLog from '../models/AuditLog.js';
import { emitToAdmin, emitToUser } from '../services/socket.service.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const successfulOrders = await Order.find({ 'paymentInfo.status': 'SUCCESS' }).lean();
    const totalRevenue = successfulOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const activeGroups = await GroupDeal.countDocuments({ status: { $in: ['ACTIVE', 'ALMOST_FULL'] } });
    const completedGroups = await GroupDeal.countDocuments({ status: 'COMPLETED' });
    const totalCoupons = await Coupon.countDocuments();
    const refundsCount = await Order.countDocuments({ 'paymentInfo.status': 'REFUNDED' });

    // Recent 7 days revenue chart mock/data
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const revenueTrend = dayNames.map((day, idx) => ({
      day,
      revenue: Math.round(totalRevenue * (0.10 + (idx * 0.02) + Math.random() * 0.05)),
      orders: Math.floor(totalOrders * (0.09 + (idx * 0.02) + Math.random() * 0.03)),
      groupBuys: Math.floor(activeGroups * 1.5 + idx * 2)
    }));

    // Category distribution
    const categoryDistribution = [
      { name: 'Electronics', value: 42, color: '#10B981' },
      { name: 'Fashion', value: 24, color: '#F59E0B' },
      { name: 'Beauty', value: 16, color: '#EC4899' },
      { name: 'Home', value: 12, color: '#3B82F6' },
      { name: 'Others', value: 6, color: '#8B5CF6' }
    ];

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        activeGroups,
        completedGroups,
        totalCoupons,
        refundsCount
      },
      charts: {
        revenueTrend,
        categoryDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.trackingHistory.push({
      status,
      message: note || `Order status updated to ${status}.`,
      timestamp: new Date()
    });

    if (status === 'REFUNDED') {
      order.paymentInfo.status = 'REFUNDED';
    }

    await order.save();

    await AuditLog.create({
      action: 'ORDER_STATUS_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'ORDER',
      targetId: order._id.toString(),
      details: { orderNumber: order.orderNumber, status }
    });

    emitToUser(order.user.toString(), 'order:status_updated', {
      orderId: order._id,
      status
    });

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.role = role;
    await user.save();

    await AuditLog.create({
      action: 'USER_ROLE_CHANGED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'USER',
      targetId: user._id.toString(),
      details: { email: user.email, newRole: role }
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
};
