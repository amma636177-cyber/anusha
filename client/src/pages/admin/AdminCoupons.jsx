import React, { useState, useEffect } from 'react';
import { Tag, Plus, Sparkles, Trash2, Clock, Check, RefreshCw } from 'lucide-react';
import api from '../../utils/api.js';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 999,
    maxDiscount: 500,
    validDays: 14,
    isGroupOnly: false
  });

  // AI Generator Prompt
  const [aiPrompt, setAiPrompt] = useState('Create a weekend electronics group buy coupon');
  const [generatingAi, setGeneratingAi] = useState(false);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      if (res.success) setCoupons(res.coupons || []);
    } catch (e) {
      console.warn('Coupons load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // Section 21: AI Coupon Generator
  const handleGenerateAI = async () => {
    if (!aiPrompt) return;
    try {
      setGeneratingAi(true);
      const res = await api.post('/ai/generate-coupon', { prompt: aiPrompt });
      if (res.success && res.coupon) {
        const c = res.coupon;
        setForm({
          code: c.code || 'WEEKEND20',
          description: c.description || 'Special promotional discount',
          discountType: c.discountType || 'PERCENTAGE',
          discountValue: c.discountValue || 20,
          minOrderValue: c.minOrderValue || 1500,
          maxDiscount: c.maxDiscount || 600,
          validDays: c.validDays || 7,
          isGroupOnly: c.isGroupOnly || false
        });
      }
    } catch (e) {
      alert('AI Coupon Generator note: ' + e.message);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const endDate = new Date(Date.now() + (form.validDays || 14) * 86400000);
      const payload = {
        ...form,
        endDate
      };
      const res = await api.post('/coupons', payload);
      if (res.success) {
        setShowModal(false);
        loadCoupons();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      loadCoupons();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Coupon & Promotion Engine</h1>
          <p className="text-xs text-stone-500">Create, monitor, and AI-generate promotional campaigns</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-premium-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Grid of Coupons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="bg-white rounded-3xl border border-stone-200 p-5 shadow-premium-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-base font-black text-stone-900">{coupon.code}</span>
                <button onClick={() => handleDelete(coupon._id)} className="text-stone-400 hover:text-rose-600 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-xl font-black text-emerald-700 block">
                {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
              </span>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{coupon.description}</p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <span>Min: ₹{coupon.minOrderValue?.toLocaleString('en-IN') || 0}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                {new Date(coupon.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Coupon Generator Modal (Section 21) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-premium-lg max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="font-extrabold text-sm text-stone-900">Create Promotional Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            {/* AI Generator Strip */}
            <div className="p-4 bg-gradient-to-r from-emerald-50/70 to-stone-50 border-b border-emerald-100 space-y-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                AI Coupon Generator (Plain English)
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Create a weekend electronics group buy coupon"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 bg-white text-xs px-3 py-1.5 border border-stone-200 rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={generatingAi}
                  className="py-1.5 px-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  {generatingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCoupon} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER25"
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    value={form.validDays}
                    onChange={(e) => setForm({ ...form, validDays: Number(e.target.value) })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">Description</label>
                  <input
                    type="text"
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold shadow-premium-sm"
                >
                  Save &amp; Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
