import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    groupSavings: 0,
    couponDiscount: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0,
    appliedCoupon: { code: '', discountAmount: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      console.warn('Cart load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({
        items: [],
        subtotal: 0,
        groupSavings: 0,
        couponDiscount: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
        appliedCoupon: { code: '', discountAmount: 0 }
      });
    }
  }, [isAuthenticated]);

  const addToCart = async ({ productId, groupDealId = null, isGroupBuy = false, quantity = 1, productTitle = 'Item' }) => {
    try {
      const res = await api.post('/cart/add', {
        productId,
        groupDealId,
        isGroupBuy,
        quantity
      });
      if (res.success && res.cart) {
        setCart(res.cart);
        showToast(
          isGroupBuy
            ? `🎉 Added "${productTitle}" to cart at Group Buy price!`
            : `Added "${productTitle}" to cart`,
          'success'
        );
        return true;
      }
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/item/${itemId}`, { quantity });
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/cart/item/${itemId}`);
      if (res.success && res.cart) {
        setCart(res.cart);
        showToast('Item removed from cart', 'info');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/cart/coupon', { code });
      if (res.success && res.cart) {
        setCart(res.cart);
        showToast(`Coupon "${code}" applied! You saved ₹${res.cart.appliedCoupon.discountAmount}`, 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({
        items: [],
        subtotal: 0,
        groupSavings: 0,
        couponDiscount: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
        appliedCoupon: { code: '', discountAmount: 0 }
      });
    } catch (err) {
      console.warn('Clear cart note:', err.message);
    }
  };

  const itemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <CartContext.Provider value={{
      cart,
      itemCount,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      applyCoupon,
      clearCart,
      refreshCart: fetchCart,
      toastMessage,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
