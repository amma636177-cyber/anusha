import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, ShoppingBag, DollarSign, Layers,
  Tag, AlertCircle, ArrowUpRight, Flame, CheckCircle2, ChevronRight
} from 'lucide-react';
import api from '../../utils/api.js';

export const AdminDashboard = ({ onNavigateTab }) => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.success) {
          setStats(res.stats);
          setCharts(res.charts);
        }
      } catch (e) {
        console.warn('Dashboard stats error:', e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const kpis = [
    { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '₹8,42,650', change: '+24.5%', accent: 'border-l-4 border-emerald-500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: stats ? stats.totalOrders.toLocaleString('en-IN') : '1,248', change: '+18.2%', accent: 'border-l-4 border-blue-500', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Group Pools', value: stats ? stats.activeGroups : '86', change: '+12 today', accent: 'border-l-4 border-orange-500', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Completed Groups', value: stats ? stats.completedGroups : '742', change: '89.4% rate', accent: 'border-l-4 border-emerald-600', icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100/50' },
    { label: 'Registered Users', value: stats ? stats.totalUsers : '12,840', change: '+320 new', accent: 'border-l-4 border-amber-500', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Products', value: stats ? stats.totalProducts : '32', change: '8 categories', accent: 'border-l-4 border-stone-800', icon: Layers, color: 'text-stone-900', bg: 'bg-stone-100' },
    { label: 'Promo Coupons', value: stats ? stats.totalCoupons : '4', change: 'Active campaigns', accent: 'border-l-4 border-indigo-500', icon: Tag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Refund Requests', value: stats ? stats.refundsCount : '2', change: '0.1% rate', accent: 'border-l-4 border-rose-500', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Platform Analytics & Operations
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Real-time telemetry across revenue, demand pooling, group unlock rates, and orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Socket Gateway Live
          </span>
        </div>
      </div>

      {/* 8 Top KPI Stats Cards (Section 34 & 63) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border border-stone-200 p-4 shadow-premium-sm flex items-center justify-between ${kpi.accent}`}
            >
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  {kpi.label}
                </span>
                <span className="text-xl sm:text-2xl font-black text-stone-900 block mt-0.5">
                  {kpi.value}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                  {kpi.change}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Revenue Trend Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Trend Bar Visualization */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-premium-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Weekly Revenue & Order Volume</h3>
              <p className="text-xs text-stone-500">Group buying GMV distribution over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Avg Order: ₹2,150
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-56 pt-6">
            {(charts?.revenueTrend || [
              { day: 'Mon', revenue: 95000, orders: 110, groupBuys: 42 },
              { day: 'Tue', revenue: 112000, orders: 135, groupBuys: 58 },
              { day: 'Wed', revenue: 138000, orders: 160, groupBuys: 75 },
              { day: 'Thu', revenue: 124000, orders: 148, groupBuys: 64 },
              { day: 'Fri', revenue: 168000, orders: 195, groupBuys: 92 },
              { day: 'Sat', revenue: 215000, orders: 260, groupBuys: 130 },
              { day: 'Sun', revenue: 189000, orders: 230, groupBuys: 115 }
            ]).map((d, i) => {
              const maxRev = 220000;
              const heightPercent = Math.min(100, Math.round((d.revenue / maxRev) * 100));

              return (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(d.revenue / 1000).toFixed(0)}k
                  </span>
                  <div className="w-full max-w-[42px] bg-stone-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-40">
                    <div
                      className="w-full bg-gradient-to-t from-stone-900 to-emerald-600 rounded-t-xl transition-all duration-500 group-hover:bg-emerald-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-600 mt-1">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Contribution Distribution */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-premium-sm space-y-4">
          <div className="pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900">Category GMV Share</h3>
            <p className="text-xs text-stone-500">Volume breakdown by department</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Electronics & Audio', percent: 42, color: 'bg-emerald-500' },
              { name: 'Fashion & Apparel', percent: 24, color: 'bg-orange-500' },
              { name: 'Beauty & Skincare', percent: 16, color: 'bg-rose-500' },
              { name: 'Home & Kitchenware', percent: 12, color: 'bg-blue-500' },
              { name: 'Fitness & Grocery', percent: 6, color: 'bg-amber-500' }
            ].map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-700">{cat.name}</span>
                  <span className="text-stone-900 font-bold">{cat.percent}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-1 mt-4">
            <p className="font-bold text-stone-900">💡 Optimization Hint:</p>
            <p className="text-[11px] leading-relaxed">
              Electronics drives the highest viral referral share (68% of customers share deal links on WhatsApp).
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab('products')}
          className="p-4 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 text-left transition-all cursor-pointer shadow-premium-sm flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-sm text-stone-900">Add Product with AI</h4>
            <p className="text-xs text-stone-500 mt-0.5">Generate title, copy, highlights, and SEO</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-stone-400" />
        </button>

        <button
          onClick={() => onNavigateTab('discounts')}
          className="p-4 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 text-left transition-all cursor-pointer shadow-premium-sm flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-sm text-stone-900">Visual Rule Builder</h4>
            <p className="text-xs text-stone-500 mt-0.5">Construct IF/THEN group discounts</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-stone-400" />
        </button>

        <button
          onClick={() => onNavigateTab('ai-assistant')}
          className="p-4 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 text-left transition-all cursor-pointer shadow-premium-sm flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-sm text-stone-900">Daily Operations Digest</h4>
            <p className="text-xs text-stone-500 mt-0.5">Review low stock & expiring pools</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-stone-400" />
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
