import React from 'react';

export const ProgressBar = ({ current, max, min = 5, showLabels = true, size = 'md' }) => {
  const percent = Math.min(100, Math.round((current / max) * 100));
  const isCompleted = current >= max;
  const isAlmostFull = current >= max - 2;

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-stone-700 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <strong className="text-stone-900">{current}</strong> of {max} joined
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : isAlmostFull
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'bg-stone-100 text-stone-600'
          }`}>
            {isCompleted ? 'Group Full' : isAlmostFull ? 'Only a few spots left!' : `${percent}% unlocked`}
          </span>
        </div>
      )}

      {/* Progress track */}
      <div className={`w-full bg-stone-200 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isCompleted
              ? 'bg-emerald-500'
              : isAlmostFull
              ? 'bg-gradient-to-r from-emerald-500 to-orange-500'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
