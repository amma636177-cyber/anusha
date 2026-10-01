import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, CheckCircle2, Truck, RefreshCw, XCircle } from 'lucide-react';
import api from '../../utils/api.js';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      let url = '/admin/orders';
      if (statusFilter !== 'ALL') url += `?status=${statusFilter}`;
      if (search) url += `${statusFilter !== 'ALL' ? '&' : '?'}search=${search}`;

      const res = await api.get(url);
      if (res.success) setOrders(res.orders || []);
    } catch (e) {
      console.warn('Orders load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      loadOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Order & Fulfillment Center</h1>
          <p className="text-xs text-stone-500">Manage order statuses, logistics handoffs, and refund processing</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium text-stone-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="PACKED">PACKED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-premium-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items / Pool</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status &amp; Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-stone-900 block">#{o.orderNumber}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-stone-900">{o.user?.name || 'Customer'}</p>
                    <span className="text-[10px] text-stone-500">{o.user?.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-stone-800 truncate max-w-xs">{o.items?.[0]?.title || 'Product'}</p>
                    <span className="text-[10px] text-stone-500">
                      {o.items?.length > 1 ? `+ ${o.items.length - 1} more items` : `Qty: ${o.items?.[0]?.quantity || 1}`}
                      {o.items?.[0]?.isGroupBuy && (
                        <span className="ml-1 text-emerald-700 font-bold">Group Buy</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-stone-900 text-sm">
                      ₹{o.pricing?.total?.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-stone-700 uppercase text-[10px]">
                      {o.paymentInfo?.method || 'UPI'} • {o.paymentInfo?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className={`font-bold px-2 py-1 rounded-lg border text-xs cursor-pointer ${
                        o.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : o.status === 'CANCELLED' || o.status === 'REFUNDED'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-stone-50 text-stone-800 border-stone-200'
                      }`}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="PACKED">PACKED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
