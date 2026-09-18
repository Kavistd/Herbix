import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Tag, 
  Check, 
  Minus, 
  Plus, 
  X,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import ProductState from '../components/common/ProductState';

export default function CartPage() {
  const { 
    items, productsLoading, productsError, refreshProducts, cartAdjusted, 
    totalCount, 
    subtotal, 
    deliveryFee, 
    discountAmount, 
    total, 
    freeDeliveryProgress, 
    freeDeliveryRemaining, 
    increaseQuantity, 
    decreaseQuantity, 
    removeItem, 
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    FREE_DELIVERY_THRESHOLD
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="w-full bg-cream-50 min-h-screen pb-20 text-charcoal-900">
      {/* Header Breadcrumb */}
      <div className="border-b border-cream-200/80 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-charcoal-500">
            <Link to="/" className="hover:text-botanical-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-botanical-950 font-semibold">Shopping Bag</span>
          </nav>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-charcoal-400 hover:text-red-600 transition-colors"
            >
              Clear all items
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title & Count */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-botanical-950">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            {totalCount} item{totalCount !== 1 ? 's' : ''} prepared for natural throat comfort
          </p>
        </div>

        {/* ========================================================================= */}
        {/* EMPTY STATE                                                               */}
        {/* ========================================================================= */}
        {cartAdjusted && <p role="status" className="mb-4 text-sm text-ginger-700">Your bag has been updated for current stock. Unavailable products cannot be purchased.</p>}
        {productsLoading || productsError ? <ProductState loading={productsLoading} error={productsError} retry={refreshProducts} /> : items.length === 0 ? (
          <div className="py-20 px-6 max-w-xl mx-auto text-center bg-white rounded-4xl border border-cream-200 shadow-soft">
            <div className="w-18 h-18 rounded-3xl bg-cream-100 border border-cream-200 flex items-center justify-center text-ginger-600 mx-auto mb-5 shadow-soft-xs">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-botanical-950">
              Your bag is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-2 leading-relaxed max-w-sm mx-auto">
              You haven't added any herbal chewable bites yet. Discover our Ceylon ginger, lemon, and pepper blends crafted for everyday vocal comfort.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button to="/shop" variant="ginger" size="lg" className="w-full sm:w-auto shadow-ginger">
                Explore The Shop
              </Button>
              <Button to="/" variant="outline" size="lg" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </div>

            <div className="mt-10 pt-6 border-t border-cream-200/80 grid grid-cols-2 gap-4 text-[11px] text-charcoal-500 font-medium">
              <span className="flex items-center justify-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-leaf-600" /> Free Shipping over LKR 2,000
              </span>
              <span className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-leaf-600" /> 100% Natural Ceylon Spices
              </span>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* POPULATED CART LAYOUT: 8 COLS ITEMS & 4 COLS SUMMARY                      */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: ITEMS & FREE DELIVERY PROGRESS (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Free Delivery Progress Indicator */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-cream-200 shadow-soft">
                <div className="flex items-center justify-between text-xs font-semibold text-botanical-950 mb-2">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-ginger-600 shrink-0" />
                    {freeDeliveryRemaining === 0 ? (
                      <span className="text-leaf-700 font-bold">
                        🎉 Congratulations! You have unlocked FREE Islandwide Delivery!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-ginger-700">LKR {freeDeliveryRemaining.toLocaleString()}</strong> more to unlock FREE Delivery
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-charcoal-500 text-[11px]">{freeDeliveryProgress}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-cream-200/80 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-leaf-500 to-leaf-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Table Card */}
              <div className="bg-white rounded-4xl border border-cream-200/90 divide-y divide-cream-100 shadow-soft overflow-hidden">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    {/* Item Thumbnail & Details */}
                    <div className="flex items-center gap-4">
                      {/* Product thumbnail */}
                      <div className="w-16 h-18 sm:w-20 sm:h-20 rounded-2xl border border-cream-200 shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-b from-cream-100 to-cream-50 flex items-center justify-center p-2">
                            <div className="w-10 h-12 rounded-xl bg-botanical-900 border border-leaf-700 flex flex-col justify-between p-1 text-center shadow-sm">
                              <span className="text-[6px] text-leaf-300 font-mono">HERBIX</span>
                              <span className="w-2 h-2 rounded-full bg-ginger-400 mx-auto" />
                              <span className="text-[5px] text-cream-300 font-mono">No image</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Name & Variant */}
                      <div>
                        <Link 
                          to={`/product/${item.id}`}
                          className="font-display font-bold text-base sm:text-lg text-botanical-950 hover:text-ginger-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs font-medium text-ginger-700 mt-0.5">
                          {item.subtitle}
                        </p>
                        <p className="text-[11px] text-charcoal-400 mt-0.5">
                          {item.unit}
                        </p>

                        {/* Unit Price */}
                        <p className="text-xs font-semibold text-charcoal-700 mt-1">
                          LKR {item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls & Item Total */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-5 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-100">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-cream-300 rounded-full bg-cream-50 px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal-700 hover:bg-cream-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-botanical-950 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal-700 hover:bg-cream-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-display font-extrabold text-base sm:text-lg text-botanical-950 min-w-[90px] text-right">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove product"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Reassurance Strip */}
              <div className="flex items-center justify-between text-xs text-charcoal-500 px-2">
                <Link to="/shop" className="inline-flex items-center gap-1.5 font-semibold text-botanical-900 hover:text-ginger-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
                <span>Free returns within 30 days &bull; Sealed food-grade packaging</span>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY CARD (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Order Summary Card */}
              <div className="bg-white rounded-4xl p-6 sm:p-8 border border-cream-200 shadow-soft">
                <h2 className="font-display font-bold text-xl text-botanical-950 pb-4 border-b border-cream-200">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-charcoal-600">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="font-semibold text-botanical-950">
                      LKR {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Delivery */}
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span>Delivery</span>
                      {deliveryFee === 0 && (
                        <span className="text-[10px] font-bold text-leaf-700 bg-leaf-50 px-1.5 py-0.5 rounded">
                          FREE
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-botanical-950">
                      {deliveryFee === 0 ? 'FREE' : `LKR ${deliveryFee}`}
                    </span>
                  </div>

                  {/* Discount */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-leaf-700 font-medium">
                      <span>Discount ({coupon.code})</span>
                      <span>- LKR {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Input Card */}
                <div className="mt-5 pt-4 border-t border-cream-200">
                  {coupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-leaf-50 border border-leaf-200 text-xs text-leaf-800">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-leaf-600" />
                        <span className="font-bold">{coupon.code}</span>
                        <span>(15% off)</span>
                      </div>
                      <button 
                        onClick={removeCoupon} 
                        className="text-leaf-700 hover:text-leaf-950 p-1"
                        aria-label="Remove coupon"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo code (e.g. COMFORT15)"
                        className="flex-1 bg-cream-50 text-charcoal-900 px-3.5 py-2 rounded-xl text-xs border border-cream-300 focus:outline-none focus:border-leaf-600 uppercase font-mono"
                      />
                      <Button type="submit" variant="secondary" size="sm" rounded="xl">
                        Apply
                      </Button>
                    </form>
                  )}

                  {couponMessage && !coupon && (
                    <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {couponMessage.message}
                    </p>
                  )}
                </div>

                {/* Final Total */}
                <div className="mt-6 pt-4 border-t border-cream-200 flex justify-between items-baseline">
                  <span className="font-display font-bold text-lg text-botanical-950">Total</span>
                  <div className="text-right">
                    <span className="font-display font-black text-2xl sm:text-3xl text-botanical-950">
                      LKR {total.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-charcoal-400 mt-0.5">Includes taxes & duties</p>
                  </div>
                </div>

                {/* Proceed to Checkout CTA */}
                <Button
                  to="/checkout"
                  variant="ginger"
                  size="lg"
                  className="w-full mt-6 shadow-ginger"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping Link */}
                <div className="mt-4 text-center">
                  <Link 
                    to="/shop" 
                    className="text-xs text-charcoal-500 hover:text-botanical-950 underline underline-offset-2 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust Seal */}
                <div className="mt-6 pt-5 border-t border-cream-100 flex items-center justify-center gap-2 text-[11px] text-charcoal-500">
                  <ShieldCheck className="w-4 h-4 text-leaf-600" />
                  <span>Encrypted 256-bit Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
