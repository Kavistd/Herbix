import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Check, 
  Heart, 
  Bell, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Minus, 
  Plus,
  Clock
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite
}) {
  const [quantity, setQuantity] = useState(1);
  const [notified, setNotified] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');

  // Close on ESC key and prevent body scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => { setQuantity(1); setNotified(false); }, [product?.id, isOpen]);

  if (!isOpen || !product) return null;

  const isAvailable = product.isAvailable;

  const handleAdd = () => {
    if (isAvailable && onAddToCart) {
      if (onAddToCart(product, quantity) !== false) onClose();
    }
  };

  const handleNotify = (e) => {
    e.preventDefault();
    if (notifyEmail) {
      setNotified(true);
      setTimeout(() => {
        setNotified(false);
        setNotifyEmail('');
        onClose();
      }, 2000);
    }
  };

  // Accent styling based on variant
  const getTinGradient = () => {
    if (product.id === 'herbix-ginger-boost') return 'from-ginger-800 via-amber-950 to-ginger-900 border-ginger-600/50';
    if (product.id === 'herbix-lemon-fresh') return 'from-botanical-900 via-emerald-950 to-yellow-950 border-lemon-500/50';
    if (product.id === 'herbix-sugar-free') return 'from-leaf-900 via-botanical-950 to-leaf-950 border-leaf-600/50';
    return 'from-botanical-900 via-botanical-950 to-botanical-900 border-leaf-700/60';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-botanical-950/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl bg-white rounded-4xl shadow-2xl border border-cream-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-cream-100 text-charcoal-700 hover:bg-cream-200 hover:text-botanical-950 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Product Visual */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative aspect-square w-full rounded-3xl border border-cream-200 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={`${product.name} — herbal bite pouch`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gradient-to-b from-cream-100 to-cream-50 p-6 flex items-center justify-center">
                    {/* Ambient glow */}
                    <div className="absolute inset-0 bg-warm-glow opacity-80 pointer-events-none" />

                    {/* Tin Mockup (used only where no real photo exists yet) */}
                    <div className={`relative w-36 h-44 sm:w-40 sm:h-48 rounded-2xl bg-gradient-to-b ${getTinGradient()} p-4 shadow-xl border-2 flex flex-col justify-between text-center`}>
                      <div className="flex items-center justify-between text-[8px] text-leaf-300 uppercase font-mono border-b border-white/10 pb-1">
                        <span>HERBIX</span>
                        <span>{product.category}</span>
                      </div>

                      <div className="my-auto py-1 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-ginger-500/20 border border-ginger-400/40 flex items-center justify-center mb-1">
                          <Sparkles className="w-4 h-4 text-ginger-300" />
                        </div>
                        <span className="font-display font-black text-white text-base tracking-wider">
                          {product.name}
                        </span>
                        <span className="text-[9px] text-ginger-400 font-serif italic mt-0.5">
                          Herbal Bites
                        </span>
                      </div>

                      <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8px] text-cream-200 font-mono">
                        <span>{product.unit}</span>
                        <span>{isAvailable ? 'AVAILABLE' : 'PREVIEW'}</span>
                      </div>

                      {/* Floating bite lozenge */}
                      <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-br from-ginger-400 to-ginger-600 border-2 border-white shadow-ginger flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-lemon-300" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={isAvailable ? (product.badgeVariant || 'ginger') : 'outline'}
                    size="sm"
                    dot={isAvailable}
                  >
                    {product.badge}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product Meta & Purchase Box */}
            <div className="md:col-span-7 flex flex-col">
              {/* Rating & Favorite */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 bg-cream-100 px-2.5 py-1 rounded-full text-xs font-semibold text-charcoal-800">
                  {product.rating ? (
                    <>
                      <Star className="w-3.5 h-3.5 fill-lemon-400 text-lemon-400" />
                      <span>{product.rating}</span>
                      <span className="text-charcoal-400">({product.reviewsCount} reviews)</span>
                    </>
                  ) : (
                    <span className="text-charcoal-400">
                      {isAvailable ? 'No reviews yet' : product.availability}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onToggleFavorite && onToggleFavorite(product.id)}
                  className={`p-2 rounded-full border transition-all ${
                    isFavorite 
                      ? 'bg-red-50 border-red-200 text-red-500' 
                      : 'bg-cream-50 border-cream-200 text-charcoal-400 hover:text-red-500'
                  }`}
                  aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-botanical-950">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-ginger-600 mt-1">
                {product.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-charcoal-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Price Row */}
              <div className="mt-4 p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-baseline gap-2">
                <span className="text-xs font-bold text-botanical-950">LKR</span>
                <span className="font-display font-extrabold text-2xl text-botanical-950">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-charcoal-400 line-through ml-1">
                    LKR {product.originalPrice}
                  </span>
                )}
                {product.isComingSoon && (
                  <span className="ml-auto text-[11px] font-semibold text-charcoal-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-ginger-500" /> Estimated Launch Price
                  </span>
                )}
              </div>

              {/* Purchase vs Coming Soon Action */}
              {isAvailable ? (
                <div className="mt-5 flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between border border-cream-300 rounded-full bg-white px-3 py-2 w-32 shadow-soft-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal-600 hover:bg-cream-100 font-bold text-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm text-botanical-950">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, Math.min(product.stock, quantity + 1)))}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal-600 hover:bg-cream-100 font-bold text-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAdd}
                    variant="ginger"
                    size="md"
                    className="flex-1 shadow-ginger"
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                  >
                    Add to Cart &bull; LKR {(product.price * quantity).toLocaleString()}
                  </Button>
                </div>
              ) : product.isComingSoon ? (
                <div className="mt-5 p-4 rounded-2xl bg-cream-100/70 border border-cream-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-botanical-900 mb-2">
                    <Bell className="w-4 h-4 text-ginger-600" />
                    <span>{product.availability}</span>
                  </div>
                  <p className="text-xs text-charcoal-500 mb-3">
                    Be the first in Sri Lanka to receive an exclusive early tasting batch when it launches.
                  </p>
                  
                  {notified ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-leaf-700 bg-leaf-50 p-2.5 rounded-xl border border-leaf-200">
                      <Check className="w-4 h-4" /> You're subscribed for the early launch drop!
                    </div>
                  ) : (
                    <form onSubmit={handleNotify} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="Enter email for notification..."
                        className="flex-1 bg-white text-charcoal-900 px-3.5 py-2 rounded-xl text-xs border border-cream-300 focus:outline-none focus:border-leaf-600"
                      />
                      <Button type="submit" variant="primary" size="sm" rounded="xl">
                        Notify Me
                      </Button>
                    </form>
                  )}
                </div>
              ) : <p className="mt-5 rounded-2xl bg-cream-100 p-4 text-sm">Out of stock. Please check back later.</p>}

              {/* Full Details Page Link for Herbix Original */}
              {(
                <div className="mt-4 pt-3 border-t border-cream-200 flex justify-between items-center text-xs">
                  <Link
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="font-semibold text-botanical-900 hover:text-ginger-600 underline flex items-center gap-1 transition-colors"
                  >
                    View full ingredient breakdown & reviews &rarr;
                  </Link>
                  <span className="text-charcoal-400">{product.unit}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

