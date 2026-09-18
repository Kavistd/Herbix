import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { X, Search, User, ShoppingBag, ArrowRight, Sparkles, LogIn, UserPlus, Package, LayoutDashboard, LogOut } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function MobileNav({
  isOpen,
  onClose,
  cartCount,
  navLinks
}) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    showToast("You've been logged out.", { type: 'info' });
    navigate('/');
  };
  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-cream-50 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between pb-6 border-b border-cream-200/80">
            <Logo size="sm" showTagline onClick={onClose} />
            <button
              onClick={onClose}
              className="p-2 rounded-full text-charcoal-600 hover:text-botanical-950 hover:bg-cream-200/60 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="mt-5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search herbal bites, ingredients..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-full border border-cream-200 focus:outline-none focus:border-leaf-600 shadow-soft-xs text-charcoal-800 placeholder:text-charcoal-400"
              />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-colors
                  ${isActive 
                    ? 'bg-leaf-100/70 text-botanical-900 font-semibold' 
                    : 'text-charcoal-700 hover:text-botanical-950 hover:bg-cream-100'
                  }
                `}
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions & Trust */}
        <div className="mt-8 pt-6 border-t border-cream-200/80 flex flex-col gap-4">
          <Button
            to="/shop"
            variant="ginger"
            size="md"
            className="w-full"
            onClick={onClose}
          >
            Shop Herbix
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-cream-200 text-xs font-semibold text-charcoal-800 hover:bg-cream-100 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-leaf-600" />
              <span>Bag ({cartCount})</span>
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-cream-200 text-xs font-semibold text-charcoal-800 hover:bg-cream-100 transition-colors"
              >
                <LogIn className="w-4 h-4 text-ginger-600" />
                <span>Log In</span>
              </Link>
            )}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-cream-200 text-xs font-semibold text-charcoal-800 hover:bg-cream-100 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-ginger-600" />
                <span>Dashboard</span>
              </Link>
            )}
            {isAuthenticated && !isAdmin && (
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-cream-200 text-xs font-semibold text-charcoal-800 hover:bg-cream-100 transition-colors"
              >
                <User className="w-4 h-4 text-ginger-600" />
                <span>Account</span>
              </Link>
            )}
          </div>

          {/* Secondary auth actions — vary by role */}
          {!isAuthenticated && (
            <Link
              to="/register"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-leaf-200 bg-leaf-50 text-xs font-semibold text-leaf-800 hover:bg-leaf-100 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </Link>
          )}
          {isAuthenticated && !isAdmin && (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/account/orders"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-cream-200 text-xs font-semibold text-charcoal-800 hover:bg-cream-100 transition-colors"
              >
                <Package className="w-4 h-4 text-leaf-600" />
                <span>My Orders</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-cream-200 text-xs font-semibold text-charcoal-800 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
          {isAuthenticated && isAdmin && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-cream-200 text-xs font-semibold text-charcoal-800 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}

          {/* Brand pledge */}
          <div className="p-3.5 rounded-2xl bg-leaf-50/70 border border-leaf-200/60 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-leaf-600 shrink-0" />
            <p className="text-[11px] text-charcoal-600 leading-snug">
              Traditional Ceylon ginger, lemon & black pepper — 100% natural, 0% synthetic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

