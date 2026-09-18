import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { normalizeProduct } from '../services/products';

const ProductContext = createContext(null);
export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const request = useRef(0);
  const { pathname } = useLocation();
  const refresh = useCallback(async () => {
    const current = ++request.current;
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/products');
      if (current === request.current) setProducts(response.data.data.map(normalizeProduct));
    } catch (err) {
      if (current === request.current) setError(err.response?.data?.message || 'Could not load products. Please try again.');
    } finally {
      if (current === request.current) setLoading(false);
    }
  }, []);
  useEffect(() => { refresh(); return () => { request.current++; }; }, [pathname, refresh]);
  useEffect(() => {
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, [refresh]);
  return <ProductContext.Provider value={{ products, loading, error, refresh }}>{children}</ProductContext.Provider>;
}
export const useProducts = () => useContext(ProductContext);
