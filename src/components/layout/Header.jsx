import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import MobileNav from './MobileNav';
import UserMenu from './UserMenu';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { totalCount, notification } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Handle sticky scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Our Story', href: '/about' },
    { name: 'Ingredients', href: '/about#ingredients' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-cream-50/95 backdrop-blur-md shadow-soft border-b border-cream-200/90 py-3' 
            : 'bg-cream-50/80 backdrop-blur-sm border-b border-cream-200/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT: Herbix Logo & Wordmark */}
            <div className="flex items-center">
              <Logo size="md" showTagline={!isScrolled} />
            </div>

            {/* CENTER: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) => `
                    px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 relative
                    ${isActive 
                      ? 'text-botanical-950 font-semibold bg-leaf-100/60' 
                      : 'text-charcoal-700 hover:text-botanical-950 hover:bg-cream-200/60'
                    }
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Actions & CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Icon / Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full text-charcoal-700 hover:text-botanical-950 hover:bg-cream-200/70 transition-colors"
                aria-label="Search Herbix"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account Menu — content changes with auth state (guest/customer/admin) */}
              <UserMenu />

              {/* Shopping bag / cart icon with item count */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full text-charcoal-800 hover:text-botanical-950 hover:bg-cream-200/70 transition-colors group"
                aria-label={`Shopping bag with ${totalCount} items`}
              >
                <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                {totalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-ginger-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm animate-pulse-once">
                    {totalCount}
                  </span>
                )}
              </Link>

              {/* Highlighted "Shop Now" CTA */}
              <div className="hidden sm:block pl-1">
                <Button
                  to="/shop"
                  variant="ginger"
                  size="sm"
                  rounded="full"
                  className="shadow-soft"
                >
                  Shop Herbix
                </Button>
              </div>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 rounded-full text-charcoal-800 hover:text-botanical-950 hover:bg-cream-200/70 transition-colors lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Input Row */}
        {isSearchOpen && (
          <div className="border-t border-cream-200/80 bg-white/95 backdrop-blur-md px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative flex items-center">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbal chewable bites, Ceylon ginger, lemon, bundles..."
                autoFocus
                className="w-full bg-cream-50 pl-11 pr-24 py-2.5 rounded-full text-sm border border-cream-300 focus:outline-none focus:border-leaf-600 text-charcoal-900 placeholder:text-charcoal-400"
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 bg-botanical-900 hover:bg-botanical-800 text-cream-50 text-xs font-semibold rounded-full transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Global Cart Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="bg-botanical-950 text-cream-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-leaf-700/50">
              <span className="w-2 h-2 rounded-full bg-ginger-400 animate-ping" />
              <p className="text-xs font-medium">{notification}</p>
              <Link 
                to="/cart" 
                className="text-xs font-semibold text-ginger-300 hover:text-ginger-200 underline ml-2"
              >
                View Bag &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        cartCount={totalCount}
        navLinks={navLinks}
      />
    </>
  );
}

