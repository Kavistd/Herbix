import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useProducts } from './ProductContext';
import { useToast } from './ToastContext';
import api from '../services/api';

// Configurable Constants
export const FREE_DELIVERY_THRESHOLD = 2000; // LKR
export const STANDARD_DELIVERY_FEE = 350;    // LKR
export const PICKUP_DELIVERY_FEE = 0;        // LKR

export const VALID_COUPONS = {
  COMFORT15: { code: 'COMFORT15', rate: 0.15, label: '15% Off - Comfort Launch' },
  HERBIX10: { code: 'HERBIX10', rate: 0.10, label: '10% Off - Welcome Ritual' }
};

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const checkoutRequest = useRef(null);
  const { products, loading: productsLoading, error: productsError, refresh: refreshProducts } = useProducts();
  const { showToast } = useToast();
  // Persist only product identities and quantities, never cached prices/specifications.
  const [cartEntries, setItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('herbix_cart_v2') || '[]');
      return Array.isArray(saved) ? saved.filter(item => typeof item.id === 'string' && Number.isSafeInteger(item.quantity) && item.quantity > 0).map(({ id, quantity }) => ({ id, quantity })) : [];
    } catch { return []; }
  });
  const items = cartEntries.flatMap(entry => {
    const product = products.find(p => p.id === entry.id);
    return product?.isAvailable ? [{ ...product, quantity: Math.min(entry.quantity, product.stock) }] : [];
  });
  const cartAdjusted = !productsLoading && !productsError && cartEntries.some(entry => {
    const product = products.find(p => p.id === entry.id);
    return !product?.isAvailable || entry.quantity > product.stock;
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // 'standard' | 'pickup'
  const [coupon, setCoupon] = useState(() => {
    try {
      const savedCoupon = localStorage.getItem('herbix_coupon_v1');
      return savedCoupon ? VALID_COUPONS[JSON.parse(savedCoupon)?.code] || null : null;
    } catch {
      return null;
    }
  });

  const [notification, setNotification] = useState(null);

  // Sync cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('herbix_cart_v2', JSON.stringify(cartEntries));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  }, [cartEntries]);

  // Reconcile saved quantities only after a successful catalog load.
  useEffect(() => {
    if (!productsLoading && !productsError && cartAdjusted) {
      setItems(items.map(({ id, quantity }) => ({ id, quantity })));
      showToast('Your bag was updated for current product availability and stock.', { type: 'info' });
    }
  }, [products, productsLoading, productsError, cartEntries, cartAdjusted, showToast]);

  // Sync coupon to localStorage
  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('herbix_coupon_v1', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('herbix_coupon_v1');
      }
    } catch (err) {
      console.warn('Failed to save coupon to localStorage:', err);
    }
  }, [coupon]);

  // Centralized Calculations
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Delivery fee calculation
  const deliveryFee = 
    items.length === 0 
      ? 0 
      : deliveryMethod === 'pickup' 
      ? PICKUP_DELIVERY_FEE 
      : subtotal >= FREE_DELIVERY_THRESHOLD 
      ? 0 
      : STANDARD_DELIVERY_FEE;

  // Discount calculation
  const discountAmount = coupon ? Math.round(subtotal * coupon.rate) : 0;

  // Final Total
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Free delivery progress
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // Cart Operations
  const addItem = (product, quantity = 1) => {
    const current = products.find(p => p.id === product.id);
    const existing = items.find(item => item.id === product.id);
    if (productsLoading || productsError || !current?.isAvailable || !Number.isSafeInteger(quantity) || quantity < 1 || (existing?.quantity || 0) + quantity > current.stock) {
      showToast('This quantity is not currently available. Please check the stock.', { type: 'error' });
      return false;
    }
    setItems(prev => {
      const found = prev.find(item => item.id === current.id);
      return found ? prev.map(item => item.id === current.id ? { id: current.id, quantity: Math.min(current.stock, Math.min(item.quantity, current.stock) + quantity) } : item)
        : [...prev, { id: current.id, quantity }];
    });
    setNotification('Added ' + quantity + ' x "' + current.name + '" to your bag');
    setTimeout(() => setNotification(null), 3000);
    return true;
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    const product = products.find(p => p.id === id);
    if (!product?.isAvailable || !Number.isSafeInteger(newQty) || newQty > product.stock) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const increaseQuantity = (id) => {
    const item = items.find((i) => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decreaseQuantity = (id) => {
    const item = items.find((i) => i.id === id);
    if (item) updateQuantity(id, item.quantity - 1);
  };

  const clearCart = () => {
    setItems([]);
  };

  // Coupon management
  const applyCoupon = (code) => {
    const cleaned = (code || '').trim().toUpperCase();
    if (VALID_COUPONS[cleaned]) {
      setCoupon(VALID_COUPONS[cleaned]);
      return { success: true, message: `Promo code "${cleaned}" applied (${VALID_COUPONS[cleaned].rate * 100}% off)` };
    }
    return { success: false, message: 'Invalid promo code. Try "COMFORT15"' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Place Order / Checkout Handler
  const placeOrder = async (customerData) => {
    if (productsLoading || productsError || !items.length) throw new Error('Please refresh product data before checking out.');
    const payload = {
      items: items.map(item => ({ product: item.id, quantity: item.quantity })),
      customer: { email: customerData.email, phone: customerData.phone },
      shippingAddress: Object.fromEntries(['firstName', 'lastName', 'address', 'city', 'district', 'postalCode'].map(key => [key, customerData[key]])),
      deliveryMethod, paymentMethod: 'cod', couponCode: coupon?.code || null
    };
    const signature = JSON.stringify(payload);
    if (checkoutRequest.current?.signature !== signature) checkoutRequest.current = { signature, key: crypto.randomUUID() };
    try {
      const response = await api.post('/orders', payload, { headers: { 'Idempotency-Key': checkoutRequest.current.key } });
      checkoutRequest.current = null;
      clearCart(); setCoupon(null); refreshProducts();
      return response.data.data;
    } catch (err) {
      if (err.response && err.response.status < 500 && !err.response.data?.message?.includes('already being submitted')) checkoutRequest.current = null;
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items, productsLoading, productsError, refreshProducts, cartAdjusted,
        totalCount,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        freeDeliveryProgress,
        freeDeliveryRemaining,
        deliveryMethod,
        setDeliveryMethod,
        coupon,
        applyCoupon,
        removeCoupon,
        addItem,
        removeItem,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        placeOrder,
        notification,
        FREE_DELIVERY_THRESHOLD,
        STANDARD_DELIVERY_FEE
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
