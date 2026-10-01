import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-stone-200 rounded-xl shadow-premium-lg transition-all animate-bounce-subtle max-w-md">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-500 shrink-0" />}

      <p className="text-sm font-medium text-stone-800">{toast.message}</p>

      {onClose && (
        <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 rounded-lg">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
