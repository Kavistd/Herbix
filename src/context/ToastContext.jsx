import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let uid = 0;

/**
 * Herbix Toast Notification Provider
 * Lightweight, self-contained toast system for form confirmations,
 * validation errors, and general feedback across the app.
 * (Cart add/remove notifications remain on CartContext + Header — unchanged.)
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 220);
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const { type = 'success', duration = 3800 } = options;
    const id = ++uid;
    setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
    timers.current[id] = window.setTimeout(() => dismissToast(id), duration);
    return id;
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const ICON_COLORS = { success: 'text-leaf-400', error: 'text-red-400', info: 'text-lemon-400' };

function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 sm:top-24 right-3 sm:right-6 z-[60] flex flex-col gap-2.5 w-[calc(100%-1.5rem)] max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 bg-botanical-950 text-cream-50 pl-4 pr-3 py-3 rounded-2xl shadow-xl border border-leaf-700/40 transition-all duration-200 ${
              toast.leaving ? 'opacity-0 -translate-y-1.5 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100 toast-enter'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${ICON_COLORS[toast.type] || 'text-leaf-400'}`} />
            <p className="text-xs font-medium leading-snug flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-full text-leaf-300/70 hover:text-white hover:bg-botanical-900 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
