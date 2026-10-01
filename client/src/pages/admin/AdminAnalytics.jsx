import React, { useState } from 'react';
import { BarChart3, Sparkles, Send, Bot, RefreshCw, TrendingUp } from 'lucide-react';
import api from '../../utils/api.js';

export const AdminAnalytics = () => {
  const [query, setQuery] = useState('Which products had highest group participation this month?');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    try {
      setLoading(true);
      const res = await api.post('/ai/query-analytics', { query });
      if (res.success) {
        setResponse(res);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">AI Analytics Intelligence Hub</h1>
        <p className="text-xs text-stone-500">Query platform business intelligence and cohort behaviors in natural language</p>
      </div>

      {/* Query Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-3">
        <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Ask AI Analytics Engine (Groq llama-3.3-70b-versatile)
        </span>

        <form onSubmit={handleAskAI} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Which products had highest group participation this month?"
            className="flex-1 bg-stone-50 px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:bg-white focus:outline-none focus:border-stone-400 font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-5 bg-stone-900 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Analyze</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            'Which products had highest group participation this month?',
            'Analyze our average order value and coupon discount cost',
            'Suggest price tier optimization for headphones',
            'What is our completed group conversion rate?'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => { setQuery(prompt); }}
              className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* AI Intelligence Output */}
      {response && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-premium-sm space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 text-xs">
            <Bot className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-stone-900">Executive AI Analysis &amp; Recommendations</span>
          </div>

          <div className="prose prose-sm max-w-none text-xs text-stone-800 leading-relaxed whitespace-pre-line font-medium">
            {response.answer}
          </div>

          {response.data?.sales && (
            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Analyzed GMV</span>
                <span className="text-base font-black text-stone-900">₹{response.data.sales.totalRevenue?.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Analyzed Orders</span>
                <span className="text-base font-black text-stone-900">{response.data.sales.totalOrders}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Active Group Pools</span>
                <span className="text-base font-black text-stone-900">{response.data.sales.activeGroupsCount}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Completed Deals</span>
                <span className="text-base font-black text-stone-900">{response.data.sales.completedGroupsCount}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
