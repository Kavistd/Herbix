import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogIn, UserPlus, Package, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

/**
 * Account menu in the header — its contents change with auth state:
 *   Guest    → Log In / Create Account
 *   Customer → Account / My Orders / Log Out
 *   Admin    → Admin Dashboard / Log Out
 *
 * This is UI convenience only; the actual admin-route protection is
 * enforced by the backend (authenticateUser + authorizeRoles) regardless
 * of what this menu shows.
 */
export default function UserMenu() {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showToast("You've been logged out.", { type: 'info' });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div
        className="p-2 rounded-full text-charcoal-300 hidden sm:inline-flex"
        aria-hidden="true"
      >
        <User className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="relative hidden sm:block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1 p-2 rounded-full text-charcoal-700 hover:text-botanical-950 hover:bg-cream-200/70 transition-colors"
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        {isAuthenticated ? (
          <span className="w-6 h-6 rounded-full bg-leaf-100 border border-leaf-200 flex items-center justify-center text-leaf-800 font-bold text-[10px]">
            {user.name.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <User className="w-5 h-5" />
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-cream-200 shadow-soft-lg py-2 z-50">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-cream-100 hover:text-botanical-950 transition-colors"
              >
                <LogIn className="w-4 h-4 text-leaf-600" /> Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-cream-100 hover:text-botanical-950 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-ginger-600" /> Create Account
              </Link>
            </>
          ) : isAdmin ? (
            <>
              <div className="px-4 pb-2 mb-1 border-b border-cream-100">
                <p className="text-xs font-semibold text-botanical-950 truncate">{user.name}</p>
                <p className="text-[11px] text-charcoal-400 truncate">{user.email}</p>
              </div>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-cream-100 hover:text-botanical-950 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-ginger-600" /> Admin Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <>
              <div className="px-4 pb-2 mb-1 border-b border-cream-100">
                <p className="text-xs font-semibold text-botanical-950 truncate">{user.name}</p>
                <p className="text-[11px] text-charcoal-400 truncate">{user.email}</p>
              </div>
              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-cream-100 hover:text-botanical-950 transition-colors"
              >
                <User className="w-4 h-4 text-leaf-600" /> Account
              </Link>
              <Link
                to="/account/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-cream-100 hover:text-botanical-950 transition-colors"
              >
                <Package className="w-4 h-4 text-ginger-600" /> My Orders
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
