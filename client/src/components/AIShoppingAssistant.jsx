import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, ArrowUpRight, Zap, RefreshCw, Users } from 'lucide-react';
import api from '../../src/utils/api.js';

export const AIShoppingAssistant = ({ onNavigateToProduct, onNavigateToGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your AI Shopping Concierge. 🛍️\n\nI can help you find products, check live group buying pools, and unlock maximum wholesale discounts. What are you looking to buy today?`,
      products: [],
      groups: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    '🎧 Headphones under ₹3,000',
    '⚡ Active Group Deals ending soon',
    '👟 Running shoes with > 25% discount',
    '☕ Espresso machines with group savings'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await api.post('/ai/chat', { message: query, history });

      if (res.success) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: res.reply,
            products: res.recommendedProducts || [],
            groups: res.recommendedGroups || []
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I had a momentary connection issue. Please feel free to ask again or browse our active group deals!',
          products: [],
          groups: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-stone-900 hover:bg-stone-800 text-white rounded-full p-3.5 shadow-premium-lg border border-stone-700 hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer"
          title="Open AI Shopping Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs font-bold pr-1">AI Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white border border-stone-200 rounded-3xl shadow-premium-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Top Bar */}
          <div className="bg-stone-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5 leading-none">
                  PoolBuy AI Shopping Concierge
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                  ● Groq AI Active &amp; Ready
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-stone-50 border-b border-stone-200/80 px-3 py-2 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-semibold text-stone-700 bg-white border border-stone-200 hover:border-emerald-400 hover:text-emerald-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-stone-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-stone-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : 'bg-white text-stone-800 border border-stone-200 shadow-premium-sm rounded-tl-xs'
                }`}>
                  <p className="whitespace-pre-line font-medium leading-relaxed">{msg.content}</p>

                  {/* Render Product Cards inside AI response */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2">
                      <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                        Recommended Deals:
                      </span>
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setIsOpen(false);
                            onNavigateToProduct(prod.id);
                          }}
                          className="flex items-center gap-3 p-2 bg-stone-50 hover:bg-emerald-50/50 rounded-xl border border-stone-200/80 cursor-pointer transition-colors"
                        >
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                            alt={prod.title}
                            className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-stone-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-stone-900 text-[11px] truncate">{prod.title}</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="font-extrabold text-stone-900">₹{prod.price?.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-stone-400 line-through">₹{prod.mrp?.toLocaleString('en-IN')}</span>
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1 py-0.2 rounded">
                                Save ₹{prod.savings?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-stone-700 bg-white border border-stone-200 px-2 py-1 rounded-lg shrink-0 shadow-2xs">
                            View Deal
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Groups inside AI response */}
                  {msg.groups && msg.groups.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2">
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block flex items-center gap-1">
                        <Users className="w-3 h-3" /> Active Group Deals You Can Join:
                      </span>
                      {msg.groups.map((grp) => (
                        <div
                          key={grp.id}
                          onClick={() => {
                            setIsOpen(false);
                            onNavigateToGroup(grp.id);
                          }}
                          className="flex items-center justify-between p-2.5 bg-orange-50/40 hover:bg-orange-50 rounded-xl border border-orange-200/80 cursor-pointer transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-stone-900 text-[11px] truncate">{grp.productTitle}</p>
                            <p className="text-[10px] text-stone-600 mt-0.5">
                              <strong className="text-orange-700 font-bold">{grp.currentMembers} / {grp.maxMembers}</strong> joined • Price: ₹{grp.currentPrice?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-[10px] font-bold text-white bg-stone-900 px-2.5 py-1 rounded-lg shadow-2xs shrink-0 hover:bg-emerald-700 transition-colors"
                          >
                            Join Pool
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>AI Concierge is querying live group pools...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask for recommendations or price ranges..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-stone-100 text-xs text-stone-900 rounded-xl px-3 py-2.5 border border-stone-200 focus:border-stone-400 focus:outline-none focus:bg-white transition-all placeholder:text-stone-600"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 bg-stone-900 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIShoppingAssistant;
