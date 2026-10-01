import React from 'react';
import { Users, Clock, Share2, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import ProgressBar from './ProgressBar.jsx';
import CountdownTimer from './CountdownTimer.jsx';

export const GroupDealCard = ({ deal, onJoin, onViewDetails }) => {
  if (!deal) return null;

  const currentMembers = deal.currentMembers || 1;
  const maxMembers = deal.maxMembers || 10;
  const isCompleted = deal.status === 'COMPLETED' || currentMembers >= maxMembers;
  const isAlmostFull = deal.status === 'ALMOST_FULL' || currentMembers >= maxMembers - 2;

  // Next tier calculation
  const sortedTiers = [...(deal.priceTiers || [])].sort((a, b) => a.memberCount - b.memberCount);
  const nextTier = sortedTiers.find(t => t.memberCount > currentMembers);
  const neededForNext = nextTier ? nextTier.memberCount - currentMembers : 0;

  const handleShareWhatsApp = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `🔥 Hey! Join my Group Deal for "${deal.productTitle}"!\n` +
      `Current Price: ₹${deal.currentPrice.toLocaleString('en-IN')} (MRP: ₹${deal.mrp.toLocaleString('en-IN')})\n` +
      `Unlock lowest tier price ₹${deal.targetPrice.toLocaleString('en-IN')} right now!\n` +
      `Join here: ${window.location.origin}/group/${deal._id}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(deal._id)}
      className="group bg-white rounded-2xl border border-stone-200 p-4 hover:shadow-premium-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Header: Countdown & Urgency Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <CountdownTimer endTime={deal.endTime} compact={true} />
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-800'
              : isAlmostFull
              ? 'bg-orange-100 text-orange-800 animate-pulse'
              : 'bg-stone-100 text-stone-700'
          }`}>
            {isCompleted ? 'Deal Unlocked' : isAlmostFull ? 'Almost Full' : 'Active Pool'}
          </span>
        </div>

        {/* Product image & title banner */}
        <div className="flex gap-3 mb-3">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
            <img
              src={deal.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
              alt={deal.productTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-stone-500 font-semibold uppercase">Started by {deal.creatorName || 'Member'}</p>
            <h3 className="font-bold text-stone-900 text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
              {deal.productTitle}
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-extrabold text-stone-900">₹{deal.currentPrice?.toLocaleString('en-IN')}</span>
              <span className="text-xs text-stone-400 line-through">₹{deal.mrp?.toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Save ₹{(deal.mrp - deal.currentPrice)?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 mb-3">
          <ProgressBar current={currentMembers} max={maxMembers} showLabels={true} size="md" />

          {/* Next tier unlock incentive */}
          {nextTier && !isCompleted ? (
            <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
              <span className="text-stone-600 font-medium">
                <strong className="text-orange-600 font-bold">{neededForNext} more</strong> needed for next tier
              </span>
              <span className="font-bold text-stone-900">
                drops to ₹{nextTier.price.toLocaleString('en-IN')}
              </span>
            </div>
          ) : (
            <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Maximum group savings achieved for all members!
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onJoin) onJoin(deal);
            else if (onViewDetails) onViewDetails(deal._id);
          }}
          disabled={isCompleted}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-premium-sm ${
            isCompleted
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-98'
          }`}
        >
          <span>{isCompleted ? 'Group Filled' : 'Join Group'}</span>
          {!isCompleted && <ArrowRight className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleShareWhatsApp}
          title="Share on WhatsApp"
          className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    </div>
  );
};

export default GroupDealCard;
