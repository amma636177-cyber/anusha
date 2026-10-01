import React, { useState, useEffect } from 'react';
import {
  Search, ShoppingCart, Heart, Bell, User, Sparkles, Flame,
  LayoutDashboard, Shield, LogOut, ChevronDown, Check, Menu, X, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../utils/api.js';
import socket from '../utils/socket.js';

export const Header = ({ onNavigate, currentView, onOpenSearch, onOpenAuth }) => {
  const { user, isAuthenticated, logout, quickLoginAs } = useAuth();
  const { itemCount, cart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch notifications
  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    loadNotifications();

    socket.on('notification:new', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('notification:new');
    };
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('products', { search: searchQuery.trim() });
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      // Ignore
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner: Group savings ticker */}
      <div className="bg-stone-900 text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          <Flame className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          More People. Lower Prices.
        </span>
        <span className="hidden sm:inline text-stone-400">•</span>
        <span className="hidden sm:inline text-stone-300">Join active pools to unlock wholesale pricing up to 45% OFF.</span>
        <button
          onClick={() => onNavigate('group-deals')}
          className="text-white underline font-semibold hover:text-emerald-400 cursor-pointer ml-1"
        >
          Explore Deals
        </button>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center shadow-premium-sm">
              <span className="text-white font-black text-lg tracking-tighter">P</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-0.5 mt-1.5"></span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-stone-900 leading-none block">
                Pool<span className="text-emerald-600">Buy</span>
              </span>
              <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest block -mt-0.5">
                Group Buying
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-stone-700">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-stone-900 bg-stone-100 font-bold' : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('group-deals')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'group-deals' ? 'text-stone-900 bg-stone-100 font-bold' : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <span>Group Deals</span>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            </button>
            <button
              onClick={() => onNavigate('products')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'products' ? 'text-stone-900 bg-stone-100 font-bold' : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => onNavigate('recommendations')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-emerald-700 ${
                currentView === 'recommendations' ? 'bg-emerald-50 font-bold' : 'hover:bg-emerald-50/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Recommendations</span>
            </button>
          </nav>

          {/* Search bar with AI Smart Search trigger */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder='Search products or try "headphones under ₹3000"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-16 py-2 bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-xs font-medium text-stone-900 rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-all placeholder:text-stone-600"
              />
              <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => onOpenSearch && onOpenSearch(searchQuery)}
                title="AI Smart Search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white border border-stone-200 hover:border-emerald-300 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>AI</span>
              </button>
            </div>
          </form>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2">
            {/* Admin Switcher Button */}
            {user?.role === 'admin' || user?.role === 'manager' ? (
              <button
                onClick={() => onNavigate(currentView.startsWith('admin') ? 'home' : 'admin-dashboard')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-stone-700" />
                <span>{currentView.startsWith('admin') ? 'Storefront' : 'Admin Panel'}</span>
              </button>
            ) : null}

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              title="Wishlist"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer relative"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-premium-lg p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-stone-900">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[11px] text-emerald-700 font-semibold hover:underline cursor-pointer">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-4">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 5).map((n, i) => (
                        <div key={i} className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.read ? 'bg-white border-stone-100' : 'bg-stone-50 border-stone-200'
                        }`}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-stone-900">{n.title}</span>
                            <span className="text-[10px] text-stone-400">Just now</span>
                          </div>
                          <p className="text-stone-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon & Total */}
            <button
              onClick={() => onNavigate('cart')}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-all cursor-pointer shadow-premium-sm"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">
                {cart.total > 0 ? `₹${cart.total.toLocaleString('en-IN')}` : 'Cart'}
              </span>
            </button>

            {/* User Profile / Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all cursor-pointer"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                />
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-premium-lg p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="pb-2.5 mb-2.5 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900 truncate">{user?.name || 'Guest User'}</p>
                    <p className="text-[11px] text-stone-600 truncate">{user?.email || 'Not logged in'}</p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100 text-[10px]">
                      <span className="font-semibold text-stone-600">Points: <strong className="text-stone-900">{user?.rewardPoints || 0} pts</strong></span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {user?.loyaltyTier || 'Silver'}
                      </span>
                    </div>
                  </div>

                  {/* Menu links */}
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('profile'); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-stone-700 hover:bg-stone-50 font-medium cursor-pointer"
                    >
                      My Profile & Addresses
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('orders'); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-stone-700 hover:bg-stone-50 font-medium cursor-pointer"
                    >
                      My Orders & Groups
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('coupons'); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-stone-700 hover:bg-stone-50 font-medium cursor-pointer"
                    >
                      Available Coupons
                    </button>
                  </div>

                  {/* Quick Demo Switcher Section */}
                  <div className="mt-2.5 pt-2.5 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                      Quick Demo Switch
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => { quickLoginAs('anusha@customer.com', 'customer123'); setShowUserMenu(false); }}
                        className={`text-[10px] font-bold py-1 px-1.5 rounded-lg border text-center cursor-pointer ${
                          user?.email === 'anusha@customer.com'
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Shopper
                      </button>
                      <button
                        onClick={() => { quickLoginAs('admin@groupbuy.com', 'admin123'); setShowUserMenu(false); }}
                        className={`text-[10px] font-bold py-1 px-1.5 rounded-lg border text-center cursor-pointer ${
                          user?.email === 'admin@groupbuy.com'
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => { quickLoginAs('manager@groupbuy.com', 'manager123'); setShowUserMenu(false); }}
                        className={`text-[10px] font-bold py-1 px-1.5 rounded-lg border text-center cursor-pointer ${
                          user?.email === 'manager@groupbuy.com'
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Manager
                      </button>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="mt-2.5 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
