import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  ArrowUpRight, 
  Sparkles, 
  Heart, 
  Eye, 
  Clock, 
  Check 
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';

/**
 * Enhanced Herbix Product Card
 * Supports available products and future "Coming Soon" variants.
 */
export default function ProductCard({
  product,
  onQuickView,
  isFavorite = false,
  onToggleFavorite,
  className = ''
}) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const isAvailable = product.isAvailable !== false;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAvailable) {
      addItem(product, 1);
    }
  };

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else { navigate("/product/" + product.id); }
  };

  // Color theme & gradient by variant
  const getCardTheme = () => {
    if (product.id === 'herbix-ginger-boost') {
      return {
        tinBg: 'from-ginger-800 via-amber-950 to-ginger-900 border-ginger-500/50',
        glow: 'from-ginger-200/40 to-transparent',
        tagBg: 'bg-ginger-50 text-ginger-800 border-ginger-200'
      };
    }
    if (product.id === 'herbix-lemon-fresh') {
      return {
        tinBg: 'from-botanical-900 via-emerald-950 to-yellow-950 border-lemon-500/50',
        glow: 'from-lemon-200/40 to-transparent',
        tagBg: 'bg-lemon-50 text-lemon-800 border-lemon-200'
      };
    }
    if (product.id === 'herbix-sugar-free') {
      return {
        tinBg: 'from-leaf-900 via-botanical-950 to-leaf-950 border-leaf-600/50',
        glow: 'from-leaf-200/40 to-transparent',
        tagBg: 'bg-leaf-50 text-leaf-800 border-leaf-200'
      };
    }
    return {
      tinBg: 'from-botanical-900 via-botanical-950 to-botanical-900 border-leaf-700/60',
      glow: 'from-leaf-200/40 to-transparent',
      tagBg: 'bg-cream-100 text-botanical-900 border-cream-200'
    };
  };

  const theme = getCardTheme();

  return (
    <div 
      className={`group relative flex flex-col bg-white rounded-4xl border transition-all duration-500 p-5 sm:p-6 shadow-soft hover:shadow-soft-xl hover:-translate-y-2 overflow-hidden ${
        isAvailable 
          ? 'border-cream-200/90 hover:border-leaf-300' 
          : 'border-cream-200/70 bg-white/90 opacity-95'
      } ${className}`}
    >
      {/* Background ambient glow on hover */}
      <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700`} />

      {/* Top Meta Bar: Badge, Rating & Favorite Heart */}
      <div className="flex items-center justify-between gap-2 mb-4 z-10">
        {/* Product Badge */}
        {product.badge ? (
          <Badge 
            variant={isAvailable ? (product.badgeVariant || 'leaf') : 'outline'} 
            size="sm"
            dot={isAvailable}
          >
            {product.badge}
          </Badge>
        ) : (
          <span />
        )}

        {/* Right Actions: Rating & Favorite */}
        <div className="flex items-center gap-2">
          {product.rating ? (
            <div className="flex items-center gap-1 bg-cream-50 px-2.5 py-1 rounded-full border border-cream-200/70 text-xs font-semibold text-charcoal-700">
              <Star className="w-3.5 h-3.5 fill-lemon-400 text-lemon-400" />
              <span>{product.rating}</span>
              {product.reviewsCount > 0 && (
                <span className="text-charcoal-400 text-[11px]">({product.reviewsCount})</span>
              )}
            </div>
          ) : (
            <span />
          )}

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`p-2 rounded-full border transition-all duration-200 active:scale-90 ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-cream-200 text-charcoal-400 hover:text-red-500 hover:bg-red-50/50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Visual Product Showcase Canvas */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-cream-100/90 to-cream-50/70 group-hover:from-cream-200/60 transition-colors">
        {product.image ? (
          <img
            src={product.image}
            alt={`${product.name} — herbal bite pouch`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            {/* Ambient organic circles */}
            <div className="absolute w-44 h-44 rounded-full border border-leaf-200/40 opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

            {/* Product Tin Mockup (used only where no real photo exists yet) */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center transition-transform duration-500 group-hover:scale-105">
              <div className={`relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl bg-gradient-to-b ${theme.tinBg} p-3.5 shadow-botanical border-2 flex flex-col justify-between`}>
                {/* Tin Lid accent */}
                <div className="w-full flex items-center justify-between border-b border-white/10 pb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ginger-400" />
                  <span className="text-[7.5px] tracking-widest text-leaf-300 uppercase font-mono font-bold">HERBIX</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-lemon-400" />
                </div>

                {/* Emblem center */}
                <div className="flex flex-col items-center my-auto py-1">
                  <div className="w-7 h-7 rounded-full bg-ginger-500/20 flex items-center justify-center border border-ginger-400/40 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-ginger-300" />
                  </div>
                  <span className="text-[11px] font-display font-bold text-white tracking-wide leading-tight">
                    {product.name}
                  </span>
                  <span className="text-[7.5px] text-leaf-200 tracking-wider uppercase font-sans mt-0.5">
                    {product.category}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[7px] text-cream-300 font-mono">
                  <span>{product.unit || 'No image'}</span>
                  <span>{product.availability}</span>
                </div>

                {/* Bite droplet */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-ginger-400 to-ginger-600 shadow-ginger border-2 border-white flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-lemon-300" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hover Action Pills Overlay */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="flex-1 py-2 px-3 rounded-full bg-white/95 backdrop-blur-sm text-botanical-950 font-semibold text-xs border border-cream-200 shadow-soft hover:bg-cream-100 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-ginger-600" />
            <span>Quick View</span>
          </button>

          {isAvailable && (
            <Link
              to={`/product/${product.id}`}
              className="py-2 px-3 rounded-full bg-botanical-900 text-cream-50 font-semibold text-xs shadow-soft hover:bg-botanical-800 flex items-center justify-center gap-1 transition-colors"
              title="View full details"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Subtitle / Flavor notes */}
      <div className="mt-4">
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${theme.tagBg}`}>
          {product.subtitle}
        </span>
      </div>

      {/* Product Title & Description */}
      <div className="mt-2.5 flex-1">
        {isAvailable ? (
          <Link
            to={`/product/${product.id}`}
            className="block font-display font-bold text-lg text-botanical-950 hover:text-ginger-600 transition-colors"
          >
            {product.name}
          </Link>
        ) : (
          <Link to={'/product/' + product.id} className="font-display font-bold text-lg text-botanical-950">
            {product.name}
          </Link>
        )}

        <p className="text-xs text-charcoal-500 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="mt-5 pt-4 border-t border-cream-200/80 flex items-center justify-between gap-2">
        {/* LKR Price Display */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] font-bold text-charcoal-500">LKR</span>
            <span className="font-display font-extrabold text-xl sm:text-2xl text-botanical-950 tracking-tight">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-charcoal-400 line-through ml-1">
                LKR {product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-charcoal-400">
            {product.unitCost || product.unit || ''}
          </span>
        </div>

        {/* Action Button */}
        {isAvailable ? (
          <Button
            variant="ginger"
            size="sm"
            rounded="full"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="shrink-0 shadow-ginger group/btn"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1 transition-transform group-hover/btn:scale-110" />
            <span>Add to Cart</span>
          </Button>
        ) : (
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cream-100 text-charcoal-600 border border-cream-300 hover:bg-cream-200 transition-colors flex items-center gap-1"
          >
            <Clock className="w-3 h-3 text-ginger-600" />
            <span>Preview</span>
          </button>
        )}
      </div>
    </div>
  );
}
