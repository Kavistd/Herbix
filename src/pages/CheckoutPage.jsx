import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Truck, 
  Store, 
  CreditCard, 
  Banknote, 
  AlertCircle, 
  Check, 
  Sparkles,
  Tag,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ProductState from '../components/common/ProductState';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { 
    items, productsLoading, productsError, refreshProducts, 
    subtotal, 
    deliveryFee, 
    discountAmount, 
    total, 
    deliveryMethod, 
    setDeliveryMethod, 
    coupon, 
    applyCoupon, 
    removeCoupon, 
    placeOrder 
  } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    district: 'Colombo',
    postalCode: '',
    notes: ''
  });

  const paymentMethod = 'cod';

  const [errors, setErrors] = useState({});
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sri Lankan Districts
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  // Validation function
  const validate = () => {
    const errs = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone || formData.phone.trim().length < 9) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.address.trim()) errs.address = 'Street delivery address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isSubmitting || productsLoading || productsError) return;
    if (items.length === 0) {
      navigate('/shop');
      return;
    }

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        ...formData,
        paymentMethod
      });

      navigate('/order-success?id=' + order._id);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Could not place order', { type: 'error' });
      refreshProducts();
    } finally { setIsSubmitting(false); }
  };

  if (productsLoading || productsError) return <div className="max-w-4xl mx-auto p-8"><ProductState loading={productsLoading} error={productsError} retry={refreshProducts} /></div>;

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-bold text-2xl text-botanical-950">Your bag is empty</h2>
        <p className="text-xs text-charcoal-500 mt-2">Add items to your bag before proceeding to checkout.</p>
        <Button to="/shop" variant="ginger" size="md" className="mt-6">
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-cream-50 min-h-screen pb-24 text-charcoal-900">
      {/* Checkout Breadcrumb Header */}
      <div className="border-b border-cream-200/80 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link to="/cart" className="inline-flex items-center gap-1.5 font-semibold text-charcoal-600 hover:text-botanical-950 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to shopping bag
          </Link>
          <div className="flex items-center gap-2 text-leaf-700 bg-leaf-50 px-3 py-1 rounded-full border border-leaf-200 text-[11px] font-semibold">
            <Lock className="w-3 h-3" />
            <span>Customer Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-botanical-950 mb-8">
          Express Checkout
        </h1>

        {/* Two-Column Layout: Left Form & Right Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: CONTACT, DELIVERY, DELIVERY METHOD & PAYMENT                 */}
          {/* ========================================================================= */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 flex flex-col gap-8">
            
            {/* 1. Contact Information Card */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-cream-200 shadow-soft">
              <h2 className="font-display font-bold text-lg text-botanical-950 mb-4 pb-3 border-b border-cream-200">
                1. Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address (for order updates)"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  variant="rounded"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="077 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                  variant="rounded"
                />
              </div>
            </div>

            {/* 2. Delivery Address Card */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-cream-200 shadow-soft">
              <h2 className="font-display font-bold text-lg text-botanical-950 mb-4 pb-3 border-b border-cream-200">
                2. Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  placeholder="Kavindu"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  error={errors.firstName}
                  variant="rounded"
                />

                <Input
                  label="Last Name"
                  required
                  placeholder="Perera"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  error={errors.lastName}
                  variant="rounded"
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Street Address / Apartment / Suite"
                  required
                  placeholder="No. 45, Temple Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={errors.address}
                  variant="rounded"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City / Town"
                  required
                  placeholder="Colombo 03"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  error={errors.city}
                  variant="rounded"
                />

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 ml-1 block mb-1.5">
                    District
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-cream-50/90 text-charcoal-900 text-sm py-2.5 px-3 rounded-2xl border border-cream-300 focus:outline-none focus:border-leaf-600 shadow-soft-xs"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Postal Code"
                  required
                  placeholder="00300"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  error={errors.postalCode}
                  variant="rounded"
                />
              </div>
            </div>

            {/* 3. Delivery Method Card */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-cream-200 shadow-soft">
              <h2 className="font-display font-bold text-lg text-botanical-950 mb-4 pb-3 border-b border-cream-200">
                3. Delivery Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Standard Delivery Option */}
                <label 
                  className={`p-4 rounded-3xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-leaf-600 bg-leaf-50/40 ring-1 ring-leaf-500/30'
                      : 'border-cream-200 hover:border-cream-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="mt-1 accent-leaf-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-botanical-950 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-ginger-600" /> Standard Delivery
                      </span>
                      <span className="text-xs font-bold text-botanical-950">
                        {subtotal >= 2000 ? 'FREE' : 'LKR 350'}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Priority dispatch across Sri Lanka. 2–3 business days.
                    </p>
                  </div>
                </label>

                {/* Store Pickup / Demo Option */}
                <label 
                  className={`p-4 rounded-3xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-leaf-600 bg-leaf-50/40 ring-1 ring-leaf-500/30'
                      : 'border-cream-200 hover:border-cream-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                    className="mt-1 accent-leaf-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-botanical-950 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-leaf-600" /> Store Pickup (Demo)
                      </span>
                      <span className="text-xs font-bold text-leaf-700">FREE</span>
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      We will contact you to arrange pickup.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* 4. Payment Method Card */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-cream-200 shadow-soft">
              <h2 className="font-display font-bold text-lg text-botanical-950 mb-4 pb-3 border-b border-cream-200">
                4. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery Option */}
                <label 
                  className={`p-4 rounded-3xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-leaf-600 bg-leaf-50/40 ring-1 ring-leaf-500/30'
                      : 'border-cream-200 hover:border-cream-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    readOnly
                    className="mt-1 accent-leaf-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-botanical-950 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-leaf-600" /> Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] font-semibold text-charcoal-500">Pay on Hand</span>
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Pay cash upon receiving your fresh Herbix pouch at your doorstep.
                    </p>
                  </div>
                </label>

                <p className="text-xs text-charcoal-500">Cash on Delivery is the available payment method. No online card payment is collected.</p>
              </div>
            </div>

            {/* Submit Button for Mobile View */}
            <div className="lg:hidden">
              <Button
                type="submit"
                variant="ginger"
                size="xl"
                isLoading={isSubmitting}
                className="w-full shadow-ginger"
              >
                Place Order &bull; LKR {total.toLocaleString()}
              </Button>
            </div>
          </form>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: ORDER SUMMARY, PROMO & PLACE ORDER                          */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-white rounded-4xl p-6 sm:p-8 border border-cream-200 shadow-soft sticky top-24">
            <h2 className="font-display font-bold text-xl text-botanical-950 pb-4 border-b border-cream-200">
              Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})
            </h2>

            {/* Items List */}
            <div className="divide-y divide-cream-100 py-3 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                  {/* Thumbnail & Titles */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-xl border border-cream-200 shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-b from-cream-100 to-cream-50 flex items-center justify-center">
                          <div className="w-6 h-8 rounded-md bg-botanical-900 flex flex-col justify-between p-0.5 text-center">
                            <span className="w-1 h-1 rounded-full bg-ginger-400 mx-auto" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-botanical-950 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-charcoal-400 font-medium">
                        Qty: {item.quantity} &bull; LKR {item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>

                  {/* Line Total */}
                  <span className="font-display font-bold text-sm text-botanical-950">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-4 border-t border-cream-200">
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-leaf-50 border border-leaf-200 text-xs text-leaf-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-leaf-600" />
                    <span className="font-bold">{coupon.code}</span>
                    <span>(15% discount applied)</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={removeCoupon} 
                    className="text-leaf-700 hover:text-leaf-950 p-1"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. COMFORT15)"
                    className="flex-1 bg-cream-50 text-charcoal-900 px-3 py-2 rounded-xl text-xs border border-cream-300 focus:outline-none focus:border-leaf-600 uppercase font-mono"
                  />
                  <Button type="submit" variant="secondary" size="sm" rounded="xl">
                    Apply
                  </Button>
                </form>
              )}

              {couponFeedback && !coupon && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Financial Breakdown Table */}
            <div className="mt-5 pt-4 border-t border-cream-200 space-y-2.5 text-xs sm:text-sm text-charcoal-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-botanical-950">
                  LKR {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-botanical-950">
                  {deliveryFee === 0 ? <span className="text-leaf-700">FREE</span> : `LKR ${deliveryFee}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-leaf-700 font-semibold">
                  <span>Discount</span>
                  <span>- LKR {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-cream-200 flex justify-between items-baseline font-display">
                <span className="font-bold text-base text-botanical-950">Final Total</span>
                <div className="text-right">
                  <span className="font-black text-2xl sm:text-3xl text-botanical-950">
                    LKR {total.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-charcoal-400 font-sans mt-0.5">Includes taxes & duties</p>
                </div>
              </div>
            </div>

            {/* Place Order CTA for Desktop */}
            <Button
              onClick={handlePlaceOrder}
              variant="ginger"
              size="xl"
              isLoading={isSubmitting}
              className="w-full mt-6 shadow-ginger hidden lg:flex"
            >
              Place Order &bull; LKR {total.toLocaleString()}
            </Button>

            {/* Trust footer */}
            <div className="mt-5 pt-4 border-t border-cream-100 flex items-center justify-center gap-2 text-[11px] text-charcoal-500">
              <ShieldCheck className="w-4 h-4 text-leaf-600" />
              <span>Safe &amp; Confidential Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
