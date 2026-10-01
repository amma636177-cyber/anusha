import React, { useState } from 'react';
import {
  ShieldCheck, ArrowRight, MapPin, Truck, Lock, CheckCircle2,
  ChevronLeft, AlertCircle, ShoppingBag, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import api from '../../utils/api.js';
import PaymentModal from '../../components/PaymentModal.jsx';

export const CheckoutPage = ({ directItem = null, directPricing = null, onNavigate }) => {
  const { user } = useAuth();
  const { cart, clearCart, showToast } = useCart();

  const [address, setAddress] = useState({
    street: user?.addresses?.[0]?.street || '42, Indiranagar 100ft Road',
    city: user?.addresses?.[0]?.city || 'Bengaluru',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    postalCode: user?.addresses?.[0]?.postalCode || '560038',
    country: 'India',
    phone: user?.phone || '+91 98333 44455'
  });

  const [deliverySpeed, setDeliverySpeed] = useState('STANDARD');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Determine items and pricing source (Cart vs Direct Group Join)
  const items = directItem
    ? [directItem]
    : cart.items.map(i => ({
        product: i.product._id,
        title: i.product.title,
        image: i.product.images?.[0],
        price: i.unitPrice,
        mrp: i.product.mrp,
        quantity: i.quantity,
        isGroupBuy: i.isGroupBuy,
        groupDeal: i.groupDeal
      }));

  const pricing = directPricing || {
    subtotal: cart.subtotal,
    groupSavings: cart.groupSavings,
    couponDiscount: cart.couponDiscount,
    deliveryFee: cart.deliveryFee,
    tax: cart.tax,
    total: cart.total
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.postalCode) {
      showToast('Please enter full shipping address', 'error');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      setPlacingOrder(true);
      const res = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod: paymentDetails.method,
        customItems: directItem ? items : null,
        customPricing: directPricing ? pricing : null
      });

      if (res.success && res.order) {
        showToast('🎉 Order placed successfully!', 'success');
        if (!directItem) await clearCart();
        onNavigate('orders', { newOrderId: res.order._id });
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-stone-900">No items ready for checkout</h3>
        <button
          onClick={() => onNavigate('products')}
          className="mt-4 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('cart')}
        className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Address & Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-premium-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-stone-900">1. Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="House/Flat No., Road, Area"
                  className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Bengaluru"
                  className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="Karnataka"
                  className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  placeholder="560038"
                  className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Option */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-premium-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Truck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-stone-900">2. Delivery Preference</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setDeliverySpeed('STANDARD')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  deliverySpeed === 'STANDARD' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20' : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-stone-900">Express Delivery (3-4 Days)</span>
                  <span className="text-xs font-bold text-emerald-700">FREE</span>
                </div>
                <p className="text-[11px] text-stone-500">Reliable logistics with BlueDart / Delhivery tracking.</p>
              </label>

              <label
                onClick={() => setDeliverySpeed('AIR')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  deliverySpeed === 'AIR' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20' : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-stone-900">Priority Air Cargo (48h)</span>
                  <span className="text-xs font-bold text-stone-700">₹99</span>
                </div>
                <p className="text-[11px] text-stone-500">Expedited transit immediately once pool seals.</p>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Review & Final CTA */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-premium-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Review ({items.length} items)
            </h3>

            {/* Item Thumbnails List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 truncate">{item.title}</p>
                    <p className="text-[10px] text-stone-500">
                      Qty: {item.quantity} • {item.isGroupBuy ? 'Group Tier Locked' : 'Standard'}
                    </p>
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Lines */}
            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-stone-900">₹{pricing.subtotal?.toLocaleString('en-IN')}</span>
              </div>

              {pricing.groupSavings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span className="font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Group Buy Discount
                  </span>
                  <span className="font-bold">-₹{pricing.groupSavings?.toLocaleString('en-IN')}</span>
                </div>
              )}

              {pricing.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span className="font-semibold">Coupon Applied</span>
                  <span className="font-bold">-₹{pricing.couponDiscount?.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>GST (5%)</span>
                <span className="font-bold text-stone-900">₹{pricing.tax?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total Due</span>
                <span className="text-2xl font-black text-stone-900">
                  ₹{pricing.total?.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Savings Secured
              </span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleOpenPayment}
              disabled={placingOrder}
              className="w-full py-4 bg-stone-900 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-premium-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Continue to Secure Payment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={pricing.total}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CheckoutPage;
