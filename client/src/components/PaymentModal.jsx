import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, Smartphone, CreditCard, Landmark, X, Loader2 } from 'lucide-react';
import { triggerConfetti } from './ConfettiCelebration.js';

export const PaymentModal = ({ isOpen, onClose, totalAmount = 0, onPaymentSuccess }) => {
  const [selectedGateway, setSelectedGateway] = useState('UPI');
  const [upiId, setUpiId] = useState('anusha@oksbi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('SELECTION'); // 'SELECTION' | 'PROCESSING' | 'SUCCESS'

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setStep('PROCESSING');

    setTimeout(() => {
      setIsProcessing(false);
      setStep('SUCCESS');
      triggerConfetti();

      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess({
            method: selectedGateway,
            transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            amount: totalAmount
          });
        }
        onClose();
        setStep('SELECTION');
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-premium-lg max-w-md w-full overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold tracking-wide uppercase">Secure Payment Gateway</span>
          </div>
          {step === 'SELECTION' && (
            <button onClick={onClose} className="text-stone-400 hover:text-white p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Processing State */}
        {step === 'PROCESSING' && (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <h3 className="text-base font-bold text-stone-900">Verifying Payment...</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Communicating securely with payment provider and validating price tier locks.
            </p>
          </div>
        )}

        {/* Success State */}
        {step === 'SUCCESS' && (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-extrabold text-stone-900">Payment Verified!</h3>
            <p className="text-xs text-stone-600 mt-1">
              ₹{totalAmount.toLocaleString('en-IN')} paid successfully. Your order is confirmed.
            </p>
          </div>
        )}

        {/* Payment Selection State */}
        {step === 'SELECTION' && (
          <div className="p-5">
            {/* Amount Summary */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Total Payable</span>
                <span className="text-2xl font-black text-stone-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>Protected</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 mb-5">
              <span className="text-xs font-bold text-stone-700 block mb-1">Select Payment Mode:</span>

              <label
                onClick={() => setSelectedGateway('UPI')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedGateway === 'UPI' ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Instant UPI (GPay, PhonePe, Paytm)</span>
                    <span className="text-[10px] text-stone-500">Zero transaction charges</span>
                  </div>
                </div>
                <input type="radio" checked={selectedGateway === 'UPI'} readOnly className="accent-emerald-600" />
              </label>

              {selectedGateway === 'UPI' && (
                <div className="pl-3 pr-1 pt-1 pb-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. mobile@upi)"
                    className="w-full bg-white text-xs px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-400 focus:outline-none"
                  />
                </div>
              )}

              <label
                onClick={() => setSelectedGateway('CARD')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedGateway === 'CARD' ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Credit / Debit Card</span>
                    <span className="text-[10px] text-stone-500">Visa, Mastercard, RuPay</span>
                  </div>
                </div>
                <input type="radio" checked={selectedGateway === 'CARD'} readOnly className="accent-emerald-600" />
              </label>

              <label
                onClick={() => setSelectedGateway('NETBANKING')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedGateway === 'NETBANKING' ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Net Banking</span>
                    <span className="text-[10px] text-stone-500">All major Indian banks supported</span>
                  </div>
                </div>
                <input type="radio" checked={selectedGateway === 'NETBANKING'} readOnly className="accent-emerald-600" />
              </label>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              className="w-full py-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-premium-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Pay ₹{totalAmount.toLocaleString('en-IN')} via {selectedGateway}</span>
            </button>

            <p className="text-[10px] text-stone-400 text-center mt-3">
              Protected by 256-bit SSL encryption. Price tier locked upon confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
