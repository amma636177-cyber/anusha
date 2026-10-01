import React, { useState } from 'react';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck,
  Tag, Users, Sparkles, CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import AICartAssistant from '../../components/AICartAssistant.jsx';

export const CartPage = ({ onNavigate }) => {
  const { cart, updateQuantity, removeFromCart, applyCoupon, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setApplying(true);
    const res = await applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
    setApplying(false);
  };

  const hasItems = cart.items && cart.items.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {hasItems ? `Review your ${cart.items.length} selected items and group price savings` : 'Your cart is currently empty'}
          </p>
        </div>

        {hasItems && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            Clear Cart
          </button>
        )}
      </div>

      {!hasItems ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">Your cart is empty</h3>
          <p className="text-xs text-stone-500 mb-6">
            Join a live group pool or explore our trending products to unlock wholesale discounts.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => onNavigate('group-deals')}
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Browse Group Deals
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Shop All
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items & AI Assistant */}
          <div className="lg:col-span-8 space-y-4">
            {/* Section 19: AI Cart Assistant Banner */}
            <AICartAssistant
              cart={cart}
              onApplyGroupDeal={(groupId) => onNavigate('group-detail', { id: groupId })}
              onExploreMore={() => onNavigate('products')}
            />

            {/* Cart Items List */}
            <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-premium-sm">
              {cart.items.map((item) => (
                <div key={item._id} className="p-4 sm:p-5 flex gap-4 items-center justify-between">
                  <div className="flex gap-3 sm:gap-4 items-center min-w-0">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150'}
                      alt={item.product?.title || 'Product'}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.isGroupBuy ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <Users className="w-3 h-3 text-emerald-600" />
                            Group Buy Price
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                            Individual Buy
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm truncate max-w-xs sm:max-w-md">
                        {item.product?.title}
                      </h4>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-base font-extrabold text-stone-900">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice > item.unitPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-xs text-stone-500">
                          (₹{item.unitPrice.toLocaleString('en-IN')} each)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-4">
            {/* Coupon Box */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-stone-500" />
                Apply Coupon Code
              </span>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GROUP15, SUPER500"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-stone-50 text-xs px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-400 focus:bg-white uppercase font-bold tracking-wide"
                />
                <button
                  type="submit"
                  disabled={applying || !couponInput.trim()}
                  className="py-2 px-4 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {applying ? 'Checking...' : 'Apply'}
                </button>
              </form>

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium mt-2">{couponError}</p>
              )}

              {cart.appliedCoupon?.code && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Coupon "{cart.appliedCoupon.code}" Active
                  </span>
                  <span className="font-extrabold text-emerald-700">
                    -₹{cart.appliedCoupon.discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Price Breakdown Card (Section 24) */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-3">
              <h3 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
                Price Breakdown
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-stone-900">₹{cart.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {cart.groupSavings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span className="font-semibold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Group Buy Savings
                    </span>
                    <span className="font-bold">-₹{cart.groupSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {cart.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span className="font-semibold">Coupon Discount</span>
                    <span className="font-bold">-₹{cart.couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Estimated Taxes (GST 5%)</span>
                  <span className="font-bold text-stone-900">₹{cart.tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-stone-900">
                    {cart.deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${cart.deliveryFee}`}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Total Amount</span>
                  <span className="text-2xl font-black text-stone-900">₹{cart.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                    You save ₹{(cart.groupSavings + cart.couponDiscount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold tracking-wide transition-all shadow-premium-md flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted 256-bit secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
