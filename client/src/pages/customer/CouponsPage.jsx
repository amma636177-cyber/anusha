import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Clock, Users, ArrowRight } from 'lucide-react';
import api from '../../utils/api.js';

export const CouponsPage = ({ onNavigate }) => {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await api.get('/coupons');
        if (res.success) setCoupons(res.coupons || []);
      } catch (e) {
        // Ignore
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Available Coupons & Promos
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Stack these coupon vouchers during checkout to save even more on individual and group buy orders
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-stone-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-white rounded-3xl border border-stone-200 p-5 shadow-premium-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    coupon.isGroupOnly ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {coupon.isGroupOnly ? 'Group Buy Exclusive' : 'Storewide Coupon'}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Valid till {new Date(coupon.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-stone-900">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </span>
                  {coupon.maxDiscount && (
                    <span className="text-xs text-stone-500 font-medium">
                      (Up to ₹{coupon.maxDiscount.toLocaleString('en-IN')})
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{coupon.description}</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Min order value: ₹{coupon.minOrderValue?.toLocaleString('en-IN') || 0}
                </p>
              </div>

              {/* Code strip */}
              <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-dashed border-stone-300 rounded-2xl">
                <span className="font-mono text-sm font-black text-stone-900 tracking-wider">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === coupon.code ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
