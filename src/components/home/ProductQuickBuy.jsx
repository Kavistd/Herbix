import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check, ShieldCheck, Sparkles, Plus, Minus, Heart } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import Pricing from '../common/Pricing';

export default function ProductQuickBuy({ product, className = '' }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!addItem(product, quantity)) return;
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className={`bg-white rounded-4xl p-6 sm:p-10 lg:p-12 border border-cream-200/90 shadow-soft-xl ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Product Presentation Container */}
        <div className="lg:col-span-6">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl border border-cream-200 overflow-hidden group">
            {product.image ? (
              <img
                src={product.image}
                alt={`${product.name} — resealable herbal bite pouch`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-cream-100/90 via-cream-50 to-cream-100/60 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-ginger-300" />
              </div>
            )}

            {/* Natural Ingredients Badge Floating Top-Left */}
            <div className="absolute top-5 left-5 z-20">
              <Badge variant="leaf" size="sm" dot>
                {product.category || product.name}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column: Product Narrative & Buy Box */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Category & Stock Status */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-leaf-700 flex items-center gap-1 bg-leaf-50 px-3 py-1 rounded-full border border-leaf-200">
              <ShieldCheck className="w-3.5 h-3.5" /> {product.availability}
            </span>
          </div>

          {/* Title & Ingredients Callout */}
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-botanical-950 tracking-tight leading-tight">
            {product.name}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-ginger-600 mt-1">
            {product.subtitle}
          </p>

          {/* Short Description */}
          <p className="mt-4 text-sm sm:text-base text-charcoal-600 leading-relaxed">
            {product.description}
          </p>

          <Pricing price={product.price} currency="LKR" unit={product.unit} size="xl" className="mt-6" />

          {/* Quantity Selector & Add to Cart */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-cream-300 rounded-full bg-cream-50/80 px-4 py-2 w-full sm:w-36 shadow-soft-xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center text-charcoal-700 hover:bg-cream-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm text-botanical-950">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, Math.min(product.stock, quantity + 1)))}
                className="w-7 h-7 rounded-full flex items-center justify-center text-charcoal-700 hover:bg-cream-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              variant="ginger"
              size="lg"
              className="flex-1 shadow-ginger"
              leftIcon={<ShoppingBag className="w-5 h-5" />}
            >
              {isAdded ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Added to Bag!
                </span>
              ) : (
                <span>Add to Cart &bull; LKR {(product.price * quantity).toLocaleString()}</span>
              )}
            </Button>
          </div>

          {/* View Product Link */}
          <Link
            to={`/product/${product.id}`}
            className="mt-4 self-start text-sm font-semibold text-botanical-900 hover:text-ginger-600 underline underline-offset-2 transition-colors"
          >
            View Product &rarr;
          </Link>

          {product.ingredients.length > 0 && <div className="mt-6 pt-5 border-t border-cream-200 text-xs text-charcoal-700">{product.ingredients.join(" / ")}</div>}
        </div>
      </div>
    </div>
  );
}

