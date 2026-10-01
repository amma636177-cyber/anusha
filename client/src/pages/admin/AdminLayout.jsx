import React, { useState } from 'react';
import {
  LayoutDashboard, Package, Users, Percent, Tag, ShoppingBag,
  BarChart3, Bot, Shield, FileText, ArrowLeft, LogOut, ChevronRight,
  Sparkles, CheckCircle2, Flame, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminLayout = ({ activeTab, onSelectTab, onExitAdmin, children }) => {
  const { user, logout, quickLoginAs } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'text-stone-900' },
    { id: 'products', label: 'Products', icon: Package, badge: 'AI Generator' },
    { id: 'groups', label: 'Group Deals', icon: Users, badge: 'Live' },
    { id: 'discounts', label: 'Discount Rules', icon: Percent, badge: 'Visual Builder' },
    { id: 'coupons', label: 'Coupons', icon: Tag, badge: 'AI Generator' },
    { id: 'orders', label: 'Orders & Refunds', icon: ShoppingBag },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'AI Query' },
    { id: 'ai-assistant', label: 'AI Operations', icon: Bot, badge: 'Daily Digest' },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-stone-900 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-700"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-extrabold text-sm text-stone-900">Admin Control</span>
        </div>
        <button
          onClick={onExitAdmin}
          className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"
        >
          Exit to Store
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-stone-200 flex flex-col justify-between z-40 transition-transform duration-200
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Brand & Exit button */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center text-white font-black text-sm">
                P
              </div>
              <div>
                <span className="font-black text-sm text-stone-900 block leading-tight">PoolBuy Admin</span>
                <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wider block">Enterprise Hub</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-stone-800 text-emerald-400' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer profile & exit storefront */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/70 space-y-3">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
              alt="Admin"
              className="w-8 h-8 rounded-lg object-cover border border-stone-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-stone-900 truncate">{user?.name || 'Administrator'}</p>
              <span className="text-[10px] font-semibold text-emerald-700 uppercase">{user?.role || 'admin'}</span>
            </div>
          </div>

          <button
            onClick={onExitAdmin}
            className="w-full py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
