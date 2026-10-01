import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ endTime, showLabels = true, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(endTime) - new Date();
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
        Deal Expired
      </span>
    );
  }

  const isUrgent = timeLeft.hours < 12;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${
        isUrgent ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-stone-100 text-stone-700'
      }`}>
        <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-orange-500 animate-pulse' : 'text-stone-500'}`} />
        <span>{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex flex-col items-center bg-white border border-stone-200 rounded-lg px-2 py-1 min-w-[38px] shadow-premium-sm">
        <span className="text-sm font-bold text-stone-900 leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
        {showLabels && <span className="text-[10px] text-stone-400 font-medium uppercase mt-0.5">hrs</span>}
      </div>
      <span className="text-stone-400 font-bold">:</span>
      <div className="flex flex-col items-center bg-white border border-stone-200 rounded-lg px-2 py-1 min-w-[38px] shadow-premium-sm">
        <span className="text-sm font-bold text-stone-900 leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
        {showLabels && <span className="text-[10px] text-stone-400 font-medium uppercase mt-0.5">min</span>}
      </div>
      <span className="text-stone-400 font-bold">:</span>
      <div className={`flex flex-col items-center bg-white border rounded-lg px-2 py-1 min-w-[38px] shadow-premium-sm ${
        isUrgent ? 'border-orange-200 text-orange-600' : 'border-stone-200 text-stone-900'
      }`}>
        <span className="text-sm font-bold leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
        {showLabels && <span className="text-[10px] text-stone-400 font-medium uppercase mt-0.5">sec</span>}
      </div>
    </div>
  );
};

export default CountdownTimer;
