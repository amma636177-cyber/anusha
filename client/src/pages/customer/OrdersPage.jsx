import React, { useState, useEffect } from 'react';
import {
  Package, Clock, CheckCircle2, ChevronRight, XCircle,
  Truck, ArrowUpRight, ShieldCheck, MapPin
} from 'lucide-react';
import api from '../../utils/api.js';

export const OrdersPage = ({ onNavigate, highlightOrderId = null }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my');
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (e) {
      console.warn('Orders load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Refund will be initiated.')) return;
    try {
      const res = await api.post(`/orders/${orderId}/cancel`);
      if (res.success) {
        loadOrders();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          My Orders & Group Buys
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Track fulfillment status, invoice breakdown, and delivery progress
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 py-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 bg-stone-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900">No orders placed yet</h3>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Join a live pool or buy individually to begin saving.
          </p>
          <button
            onClick={() => onNavigate('group-deals')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Explore Group Deals
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.status === 'DELIVERED';
            const isCancelled = order.status === 'CANCELLED';
            const isShipped = order.status === 'SHIPPED' || isDelivered;

            return (
              <div
                key={order._id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all shadow-premium-sm ${
                  highlightOrderId === order._id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-200'
                }`}
              >
                {/* Top header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Order Reference
                    </span>
                    <span className="font-extrabold text-stone-900 text-sm">#{order.orderNumber}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Date Placed
                    </span>
                    <span className="font-medium text-stone-700">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Total Paid
                    </span>
                    <span className="font-extrabold text-stone-900 text-sm">
                      ₹{order.pricing?.total?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isDelivered
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isCancelled
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {isDelivered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {!isDelivered && !isCancelled && <Clock className="w-3.5 h-3.5 text-blue-600" />}
                      {isCancelled && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      <span>{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Items & Shipping row */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-xs truncate max-w-md">{item.title}</p>
                          <p className="text-[11px] text-stone-500">
                            Qty: {item.quantity} • ₹{item.price?.toLocaleString('en-IN')} each
                            {item.isGroupBuy && (
                              <span className="ml-2 font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                Group Buy Saved
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destination */}
                  <div className="sm:col-span-4 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs space-y-1">
                    <span className="font-bold text-stone-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      Shipment Destination:
                    </span>
                    <p className="text-stone-600 text-[11px] leading-tight">
                      {order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
                    </p>
                    <span className="text-[10px] text-stone-400 block pt-0.5">
                      Carrier: BlueDart Express (Air Logistics)
                    </span>
                  </div>
                </div>

                {/* Tracking Progress / History */}
                {order.trackingHistory && order.trackingHistory.length > 0 && (
                  <div className="pt-3 border-t border-stone-100 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-stone-700">Latest Tracking Update:</span>
                      {!isCancelled && !isDelivered && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-stone-700 text-xs font-medium">
                        {order.trackingHistory[order.trackingHistory.length - 1]?.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
