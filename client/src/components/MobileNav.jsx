import React from 'react';
import { Home, Compass, Users, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export const MobileNav = ({ currentView, onNavigate }) => {
  const { itemCount } = useCart();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Explore', icon: Compass },
    { id: 'group-deals', label: 'Groups', icon: Users, badge: 'Hot' },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, count: itemCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-stone-900 stroke-[2.2]' : 'text-stone-500 stroke-[1.8]'}`} />

                {item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}

                {item.badge && !item.count && (
                  <span className="absolute -top-1 -right-2.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold text-stone-900' : 'font-medium text-stone-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
