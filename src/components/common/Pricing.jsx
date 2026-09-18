import React from 'react';

/**
 * Herbix Pricing Display Component
 * 
 * @param {Object} props
 * @param {number} props.price - Current active price
 * @param {number} [props.originalPrice] - Previous price before discount
 * @param {string} [props.unit] - Unit detail, e.g. "per pack (60 bites)" or "/ bite"
 * @param {string} [props.currency='$'] - Currency symbol
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {boolean} [props.showDiscountBadge=true]
 * @param {string} [props.className]
 */
export default function Pricing({
  price,
  originalPrice,
  unit,
  currency = 'Rs.',
  size = 'md',
  showDiscountBadge = true,
  className = ''
}) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const sizeClasses = {
    sm: {
      price: 'text-base font-bold',
      original: 'text-xs',
      unit: 'text-[11px]',
    },
    md: {
      price: 'text-xl md:text-2xl font-bold',
      original: 'text-sm',
      unit: 'text-xs',
    },
    lg: {
      price: 'text-2xl md:text-3xl font-extrabold',
      original: 'text-base',
      unit: 'text-sm',
    },
    xl: {
      price: 'text-3xl md:text-4xl font-black',
      original: 'text-lg',
      unit: 'text-sm',
    }
  }[size];

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${className}`}>
      {/* Current active price */}
      <span className={`text-botanical-950 font-display tracking-tight ${sizeClasses.price}`}>
        <span className="text-[0.75em] font-semibold align-top mr-1">{currency}</span>
        {Number.isInteger(price) ? price.toLocaleString() : price.toFixed(2)}
      </span>

      {/* Strikethrough original price if on sale */}
      {hasDiscount && (
        <span className={`text-charcoal-400 line-through ${sizeClasses.original}`}>
          {currency} {Number.isInteger(originalPrice) ? originalPrice.toLocaleString() : originalPrice.toFixed(2)}
        </span>
      )}

      {/* Discount badge */}
      {hasDiscount && showDiscountBadge && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-ginger-100 text-ginger-700 border border-ginger-200">
          Save {discountPercent}%
        </span>
      )}

      {/* Optional unit info (e.g. per bite) */}
      {unit && (
        <span className={`text-charcoal-500 font-normal ${sizeClasses.unit}`}>
          {unit}
        </span>
      )}
    </div>
  );
}

