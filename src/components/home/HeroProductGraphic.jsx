import React from 'react';
import { Sparkles, Leaf, Shield } from 'lucide-react';

/**
 * HeroProductGraphic
 * High-end product mockup and ingredient presentation.
 * Can be swapped with real photography via the `imageSrc` prop or `data-replaceable` container.
 */
export default function HeroProductGraphic({ imageSrc = null, product, className = '' }) {
  return (
    <div 
      className={`relative w-full max-w-lg mx-auto flex items-center justify-center select-none ${className}`}
      data-replaceable="hero-product-showcase"
    >
      {/* Ambient background glow (subtle, warm and botanical) */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-ginger-300/25 via-lemon-200/20 to-leaf-200/30 blur-3xl pointer-events-none -z-10" />

      {/* Layered organic shape behind the product */}
      <div className="absolute w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-br from-leaf-200/70 via-lemon-100/60 to-ginger-200/50 blob-shape animate-blob pointer-events-none -z-10" />

      {/* Decorative Organic Ring */}
      <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-leaf-300/40 opacity-60 pointer-events-none" />

      {(product?.ingredients || []).slice(0, 4).map((ingredient, index) => (
        <div key={index} className={'absolute z-20 flex items-center gap-2 bg-white/95 px-3.5 py-2 rounded-2xl shadow-soft border border-leaf-200 text-xs font-semibold text-botanical-900 ' + ['-top-4 -left-4', '-top-3 -right-3', '-bottom-4 -left-2', '-bottom-3 -right-2'][index]}>
          <Leaf className="w-4 h-4 text-leaf-600" />{ingredient}
        </div>
      ))}
      {/* MAIN PRODUCT SHOWCASE CONTAINER */}
      <div
        className={`relative z-10 w-64 sm:w-72 md:w-80 aspect-[4/5] bg-gradient-to-b from-cream-100 via-white to-cream-100/90 rounded-4xl border border-cream-200 shadow-soft-xl flex flex-col justify-between items-center group transition-transform duration-500 hover:scale-[1.02] overflow-hidden ${imageSrc ? '' : 'p-6'}`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product?.name || "Herbix"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="m-auto text-center text-sm text-charcoal-500">No product image available</div>
        )}
      </div>
    </div>
  );
}

