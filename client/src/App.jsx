import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider, useCart } from './context/CartContext.jsx';

// Customer Components & Pages
import Header from './components/Header.jsx';
import MobileNav from './components/MobileNav.jsx';
import Toast from './components/Toast.jsx';
import AIShoppingAssistant from './components/AIShoppingAssistant.jsx';
import AuthModal from './components/AuthModal.jsx';

import HomePage from './pages/customer/HomePage.jsx';
import ProductsPage from './pages/customer/ProductsPage.jsx';
import ProductDetailPage from './pages/customer/ProductDetailPage.jsx';
import GroupDealsPage from './pages/customer/GroupDealsPage.jsx';
import GroupDetailPage from './pages/customer/GroupDetailPage.jsx';
import CartPage from './pages/customer/CartPage.jsx';
import CheckoutPage from './pages/customer/CheckoutPage.jsx';
import OrdersPage from './pages/customer/OrdersPage.jsx';
import WishlistPage from './pages/customer/WishlistPage.jsx';
import ProfilePage from './pages/customer/ProfilePage.jsx';
import RecommendationsPage from './pages/customer/RecommendationsPage.jsx';
import CouponsPage from './pages/customer/CouponsPage.jsx';

// Admin Components & Pages
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminGroupDeals from './pages/admin/AdminGroupDeals.jsx';
import AdminDiscountEngine from './pages/admin/AdminDiscountEngine.jsx';
import AdminCoupons from './pages/admin/AdminCoupons.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';
import AdminAIAssistant from './pages/admin/AdminAIAssistant.jsx';
import AdminAuditLogs from './pages/admin/AdminAuditLogs.jsx';

function MainApp() {
  const { user, isAdmin } = useAuth();
  const { toastMessage } = useCart();

  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState({});

  // Admin Tab State
  const [adminTab, setAdminTab] = useState('dashboard');

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Direct checkout state for Instant "Join Group"
  const [directCheckoutData, setDirectCheckoutData] = useState(null);

  const navigateTo = (view, params = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoinGroupDirect = (groupDeal) => {
    // Navigate straight to group detail or checkout
    navigateTo('group-detail', { id: groupDeal._id });
  };

  // If in Admin Panel view
  if (currentView.startsWith('admin')) {
    return (
      <AdminLayout
        activeTab={adminTab}
        onSelectTab={(tab) => setAdminTab(tab)}
        onExitAdmin={() => navigateTo('home')}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={(tab) => setAdminTab(tab)} />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'groups' && <AdminGroupDeals />}
        {adminTab === 'discounts' && <AdminDiscountEngine />}
        {adminTab === 'coupons' && <AdminCoupons />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'users' && <AdminUsers />}
        {adminTab === 'analytics' && <AdminAnalytics />}
        {adminTab === 'ai-assistant' && <AdminAIAssistant />}
        {adminTab === 'audit-logs' && <AdminAuditLogs />}
      </AdminLayout>
    );
  }

  // Customer Application Views
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111827] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-16 md:pb-0">
      {/* Universal Header */}
      <Header
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenSearch={(query) => navigateTo('products', { search: query })}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onJoinGroup={handleJoinGroupDirect}
          />
        )}

        {currentView === 'products' && (
          <ProductsPage
            initialCategory={viewParams.category}
            initialSearch={viewParams.search}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            productId={viewParams.id}
            onNavigate={navigateTo}
            onJoinGroup={handleJoinGroupDirect}
          />
        )}

        {currentView === 'group-deals' && (
          <GroupDealsPage
            onNavigate={navigateTo}
            onJoinGroup={handleJoinGroupDirect}
          />
        )}

        {currentView === 'group-detail' && (
          <GroupDetailPage
            groupId={viewParams.id}
            onNavigate={navigateTo}
            onJoinDirect={(deal) => {
              setDirectCheckoutData({
                item: {
                  product: deal.product._id,
                  title: deal.productTitle,
                  image: deal.productImage,
                  price: deal.currentPrice,
                  mrp: deal.mrp,
                  quantity: 1,
                  isGroupBuy: true,
                  groupDeal: deal._id
                },
                pricing: {
                  subtotal: deal.currentPrice,
                  groupSavings: deal.mrp - deal.currentPrice,
                  couponDiscount: 0,
                  deliveryFee: 0,
                  tax: Math.round(deal.currentPrice * 0.05),
                  total: Math.round(deal.currentPrice * 1.05)
                }
              });
              navigateTo('checkout');
            }}
          />
        )}

        {currentView === 'cart' && (
          <CartPage onNavigate={navigateTo} />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            directItem={directCheckoutData?.item}
            directPricing={directCheckoutData?.pricing}
            onNavigate={(view, p) => {
              setDirectCheckoutData(null);
              navigateTo(view, p);
            }}
          />
        )}

        {currentView === 'orders' && (
          <OrdersPage
            onNavigate={navigateTo}
            highlightOrderId={viewParams.newOrderId}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage onNavigate={navigateTo} />
        )}

        {currentView === 'profile' && (
          <ProfilePage onNavigate={navigateTo} />
        )}

        {currentView === 'recommendations' && (
          <RecommendationsPage onNavigate={navigateTo} />
        )}

        {currentView === 'coupons' && (
          <CouponsPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Floating AI Shopping Assistant (Groq-enabled with tools) */}
      <AIShoppingAssistant
        onNavigateToProduct={(productId) => navigateTo('product-detail', { id: productId })}
        onNavigateToGroup={(groupId) => navigateTo('group-detail', { id: groupId })}
      />

      {/* Mobile Bottom Navigation (Section 44) */}
      <MobileNav
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* Toast Alert */}
      <Toast toast={toastMessage} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-900 text-sm">PoolBuy</span>
            <span>•</span>
            <span>Premium AI Group Buying &amp; Discount Management Platform</span>
          </div>
          <p>© 2026 PoolBuy India Technologies Private Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
