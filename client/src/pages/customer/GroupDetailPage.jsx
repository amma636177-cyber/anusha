import React, { useState, useEffect } from 'react';
import {
  Users, Clock, MessageCircle, Share2, ShieldCheck, Truck,
  ArrowRight, CheckCircle2, Copy, Check, Star, AlertCircle, Sparkles
} from 'lucide-react';
import api from '../../utils/api.js';
import socket from '../../utils/socket.js';
import CountdownTimer from '../../components/CountdownTimer.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import PriceTierStepper from '../../components/PriceTierStepper.jsx';
import { triggerTierUnlockCelebration } from '../../components/ConfettiCelebration.js';

export const GroupDetailPage = ({ groupId, onJoinDirect, onNavigate }) => {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);

  const loadDeal = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/groups/${groupId}`);
      if (res.success && res.groupDeal) {
        setDeal(res.groupDeal);
        if (res.groupDeal.product?._id) {
          const revRes = await api.get(`/reviews/product/${res.groupDeal.product._id}`);
          if (revRes.success) setReviews(revRes.reviews || []);
        }
      }
    } catch (e) {
      console.warn('Group deal fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeal();

    // Real-time socket updates for this group
    socket.emit('join:group', groupId);

    socket.on('group:updated', (data) => {
      if (data.groupId === groupId) {
        if (data.isTierUnlocked) {
          triggerTierUnlockCelebration();
        }
        loadDeal();
      }
    });

    return () => {
      socket.emit('leave:group', groupId);
      socket.off('group:updated');
    };
  }, [groupId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!deal) return;
    const shareText = encodeURIComponent(
      `🔥 Unlock Big Savings! Join my Group Deal on "${deal.productTitle}".\n` +
      `Current Price: ₹${deal.currentPrice.toLocaleString('en-IN')} (MRP: ₹${deal.mrp.toLocaleString('en-IN')})\n` +
      `Lowest Tier Price: ₹${deal.targetPrice.toLocaleString('en-IN')} when more join!\n` +
      `Join here: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-xs text-stone-500 font-medium">Loading live group pool telemetry...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-2" />
        <h3 className="text-base font-bold text-stone-800">Group Deal Not Found</h3>
        <p className="text-xs text-stone-500 mt-1 mb-4">This group deal may have concluded or expired.</p>
        <button
          onClick={() => onNavigate('group-deals')}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
        >
          View Active Groups
        </button>
      </div>
    );
  }

  const isCompleted = deal.status === 'COMPLETED' || deal.currentMembers >= deal.maxMembers;
  const isAlmostFull = deal.status === 'ALMOST_FULL' || deal.currentMembers >= deal.maxMembers - 2;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => onNavigate('home')} className="hover:text-stone-900 cursor-pointer">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('group-deals')} className="hover:text-stone-900 cursor-pointer">Group Deals</button>
        <span>/</span>
        <span className="text-stone-800 font-semibold truncate max-w-xs">{deal.productTitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Image & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-premium-sm">
            <img
              src={deal.productImage}
              alt={deal.productTitle}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="font-bold text-stone-900 block text-[11px]">100% Verified</span>
              <span className="text-[10px] text-stone-400">Authentic brand</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="font-bold text-stone-900 block text-[11px]">Direct Delivery</span>
              <span className="text-[10px] text-stone-400">Ships to your door</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="font-bold text-stone-900 block text-[11px]">Best Price</span>
              <span className="text-[10px] text-stone-400">Locked upon join</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Progress, Tiers & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : isAlmostFull
                  ? 'bg-orange-100 text-orange-800 animate-pulse'
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {isCompleted ? '✓ Target Unlocked' : isAlmostFull ? '⚡ Almost Full' : 'Active Buyer Pool'}
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500">Group ID: #{deal.shareCode}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {deal.productTitle}
            </h1>
          </div>

          {/* Pricing Highlight Card */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-4">
            <div className="flex items-baseline justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Current Group Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-stone-900">
                    ₹{deal.currentPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{deal.mrp?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save ₹{(deal.mrp - deal.currentPrice)?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 block">Lowest Possible</span>
                <span className="text-lg font-extrabold text-stone-800">₹{deal.targetPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Live Countdown & Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-600">Time Left to Join:</span>
                <CountdownTimer endTime={deal.endTime} />
              </div>

              <div className="mt-4">
                <ProgressBar
                  current={deal.currentMembers}
                  max={deal.maxMembers}
                  showLabels={true}
                  size="lg"
                />
              </div>

              {deal.nextTier && (
                <div className="mt-3 p-3 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-orange-900 font-semibold">
                    🔥 <strong>{deal.nextTier.membersNeeded} more {deal.nextTier.membersNeeded === 1 ? 'person' : 'people'}</strong> needed to drop price to:
                  </span>
                  <span className="text-base font-extrabold text-stone-900">
                    ₹{deal.nextTier.price.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Price Tiers Stepper (Section 9, 12) */}
            <div className="pt-2">
              <PriceTierStepper
                priceTiers={deal.priceTiers}
                currentMembers={deal.currentMembers}
                currentPrice={deal.currentPrice}
              />
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 space-y-2.5">
              <button
                onClick={() => onJoinDirect(deal)}
                disabled={isCompleted}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-premium-md active:scale-98 ${
                  isCompleted
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span>{isCompleted ? 'Group Deal Full' : 'JOIN GROUP NOW'}</span>
                {!isCompleted && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-3 px-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center italic pt-1">
                "Invite friends and unlock a lower price. All members get the final discount automatically!"
              </p>
            </div>
          </div>

          {/* Members List (Section 9, 11) */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Current Members ({deal.members?.length || 0})</h3>
                <p className="text-xs text-stone-500">Started by {deal.creatorName}</p>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Orders
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto">
              {(deal.members || []).map((m, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 bg-stone-50 rounded-xl border border-stone-100">
                  <img
                    src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={m.name}
                    className="w-8 h-8 rounded-full object-cover border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{m.name}</p>
                    <p className="text-[10px] text-stone-500">Joined at ₹{m.paidAmount?.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                    LOCKED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules Accordion */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
            <h4 className="font-bold text-stone-900">Group Buying Rules:</h4>
            <ul className="list-disc pl-4 space-y-1 text-stone-600 leading-relaxed">
              {deal.rules?.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
