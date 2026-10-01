import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Tag, Users, Zap } from 'lucide-react';
import api from '../utils/api.js';

export const AICartAssistant = ({ cart, onApplyGroupDeal, onExploreMore }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!cart || !cart.items || cart.items.length === 0) {
        setInsights([]);
        return;
      }
      try {
        setLoading(true);
        const res = await api.post('/ai/cart-insights', { cart });
        if (res.success && res.insights) {
          setInsights(res.insights);
        }
      } catch (e) {
        // Fallback calculation
        const local = [];
        if (cart.subtotal < 2000) {
          local.push({
            type: 'DISCOUNT_UNLOCK',
            title: '🎁 Unlock ₹300 OFF',
            message: `Add ₹${(2000 - cart.subtotal).toLocaleString('en-IN')} more to unlock the "SUPER500" instant discount coupon!`
          });
        }
        setInsights(local);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [cart?.subtotal, cart?.items?.length]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50/80 via-white to-stone-50 border border-emerald-200/90 rounded-2xl p-3.5 mb-4 shadow-2xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs font-bold text-stone-900">AI Cart Optimizer</span>
      </div>

      <div className="space-y-2">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs bg-white/80 border border-emerald-100 p-2.5 rounded-xl">
            <div className="flex items-start gap-2 max-w-[80%]">
              {insight.type === 'GROUP_AVAILABLE' && <Users className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {insight.type === 'DISCOUNT_UNLOCK' && <Tag className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />}
              {insight.type === 'TIER_THRESHOLD' && <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold text-stone-900 leading-tight">{insight.title}</p>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">{insight.message}</p>
              </div>
            </div>

            {insight.groupId && onApplyGroupDeal && (
              <button
                onClick={() => onApplyGroupDeal(insight.groupId)}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              >
                <span>Switch</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {insight.action === 'EXPLORE_MORE' && onExploreMore && (
              <button
                onClick={onExploreMore}
                className="text-[11px] font-bold text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Explore
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AICartAssistant;
