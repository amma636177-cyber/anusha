import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, AlertTriangle, Clock, TrendingUp, CheckCircle2, ShieldAlert } from 'lucide-react';
import api from '../../utils/api.js';

export const AdminAIAssistant = () => {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDigest = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai/admin-digest');
      if (res.success) {
        setDigest(res);
      }
    } catch (e) {
      console.warn('Admin digest error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDigest();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">AI Executive Operations Briefing</h1>
          <p className="text-xs text-stone-500">Live AI synthesized issues digest, risk monitoring, and inventory alerts</p>
        </div>

        <button
          onClick={fetchDigest}
          disabled={loading}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-premium-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Briefing</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500 font-medium">Groq AI is analyzing system health, inventory, and expiring deals...</p>
        </div>
      ) : digest ? (
        <div className="space-y-6">
          {/* Executive Briefing Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-premium-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100 text-xs font-bold text-stone-900">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Today's Executive Issues Briefing (Groq Llama-3.3-70b)</span>
            </div>

            <div className="prose prose-sm max-w-none text-xs text-stone-800 leading-relaxed whitespace-pre-line font-medium bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
              {digest.briefing}
            </div>
          </div>

          {/* Telemetry Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Low stock alert */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Critical Stock Warning</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-3xl font-black text-rose-600">
                {digest.telemetry?.inventorySummary?.lowStockCount || 0}
              </span>
              <p className="text-[11px] text-stone-500">Products with ≤ 10 items remaining in stock.</p>
            </div>

            {/* Deals Ending Soon */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Expiring Deals (&lt; 12h)</span>
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-3xl font-black text-orange-600">
                {digest.telemetry?.expiringDeals?.length || 0}
              </span>
              <p className="text-[11px] text-stone-500">Active pools nearing expiration needing promotion.</p>
            </div>

            {/* Completed Pools */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Completed Group Pools</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-3xl font-black text-emerald-600">
                {digest.telemetry?.sales?.completedGroupsCount || 0}
              </span>
              <p className="text-[11px] text-stone-500">Pools that successfully locked max tier wholesale discounts.</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminAIAssistant;
