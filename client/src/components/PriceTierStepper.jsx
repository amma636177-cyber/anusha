import React from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export const PriceTierStepper = ({ priceTiers = [], currentMembers = 1, currentPrice = 0 }) => {
  if (!priceTiers || priceTiers.length === 0) return null;

  const sortedTiers = [...priceTiers].sort((a, b) => a.memberCount - b.memberCount);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Group Price Tiers</h4>
        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <Sparkles className="w-3 h-3 text-emerald-600" /> Save up to {Math.max(...sortedTiers.map(t => t.discountPercent))}%
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {sortedTiers.map((tier, idx) => {
          const isUnlocked = currentMembers >= tier.memberCount;
          const isNextTarget = !isUnlocked && (idx === 0 || currentMembers >= sortedTiers[idx - 1].memberCount);

          return (
            <div
              key={idx}
              className={`relative p-3 rounded-xl border text-center transition-all ${
                isUnlocked
                  ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/30'
                  : isNextTarget
                  ? 'bg-orange-50/40 border-orange-300'
                  : 'bg-white border-stone-200 opacity-75'
              }`}
            >
              {isUnlocked && (
                <div className="absolute -top-2 right-2 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm">
                  <Check className="w-3 h-3" />
                </div>
              )}

              {isNextTarget && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  NEXT TIER
                </span>
              )}

              <p className="text-[11px] font-medium text-stone-500">
                {tier.memberCount === 1 ? '1 Person' : `${tier.memberCount} People`}
              </p>
              <p className="text-base font-extrabold text-stone-900 mt-0.5">
                ₹{tier.price.toLocaleString('en-IN')}
              </p>
              <span className={`inline-block text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded ${
                isUnlocked ? 'text-emerald-700 bg-emerald-100/60' : 'text-stone-600 bg-stone-100'
              }`}>
                {tier.discountPercent}% OFF
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceTierStepper;
