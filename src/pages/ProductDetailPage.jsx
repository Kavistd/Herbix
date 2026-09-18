import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Leaf, 
  Heart, 
  Clock, 
  Pocket, 
  Coffee, 
  Sun, 
  Flame, 
  Zap, 
  Minus, 
  Plus, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Package, 
  ArrowRight,
  Truck,
  RotateCcw
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ProductGallery from '../components/product/ProductGallery';
import ProductReviews from '../components/product/ProductReviews';
import ProductCard from '../components/cards/ProductCard';
import { useProducts } from '../context/ProductContext';
import api from '../services/api';
import { normalizeProduct } from '../services/products';
import ProductState from '../components/common/ProductState';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage({ adminPreview = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setProduct(null); setQuantity(1);
    api.get((adminPreview ? '/admin/products/' : '/products/') + encodeURIComponent(id))
      .then(res => { if (!cancelled) setProduct(normalizeProduct(res.data.data)); })
      .catch(err => { if (!cancelled) setError(err.response?.data?.message || 'Could not load product'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, adminPreview, revision]);
  const relatedProducts = products.filter(p => p.id !== product?.id);

  // Add to Cart handler (updates global React Cart state)
  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  // Buy Now handler (updates Cart state and navigates directly to /checkout)
  const handleBuyNow = () => {
    if (addItem(product, quantity)) navigate('/checkout');
  };

  const faqs = [{ q: 'Where can I find product information?', a: 'The description and ingredient information on this page are maintained by Herbix. Contact us if you need details that are not listed.' }];
  if (loading || error || !product) return <div className="max-w-4xl mx-auto p-8"><ProductState loading={loading} error={error} retry={() => setRevision(v => v + 1)} /><Link to="/shop" className="block mt-4 underline">Back to shop</Link></div>;

  return (
    <div className="w-full bg-cream-50 min-h-screen pb-24 text-charcoal-900">
      
      {/* ========================================================================= */}
      {/* BREADCRUMB BAR                                                            */}
      {/* ========================================================================= */}
      <div className="border-b border-cream-200/80 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          {adminPreview && <p className="mb-3 text-sm text-ginger-700">Admin preview / {product.status} / <Link to="/admin/products">Back to products</Link></p>}
          <nav className="flex items-center gap-2 text-xs text-charcoal-500">
            <Link to="/" className="hover:text-botanical-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-botanical-900 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-botanical-950 font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN PRODUCT HERO GRID: LEFT GALLERY & RIGHT BUY BOX                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT SIDE: Large Product Image Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery product={product} />
          </div>

          {/* RIGHT SIDE: Product Meta & Purchase Panel */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Top Badge */}
            <div className="mb-3">
              <Badge variant="leaf" size="md" dot>
                Natural Herbal Chewable Bites
              </Badge>
            </div>

            {/* Product Title */}
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-botanical-950 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews (only shown once real customer reviews exist) */}
            <div className="mt-3 flex items-center gap-3">
              {product.rating ? (
                <a
                  href="#reviews"
                  className="flex items-center gap-1.5 bg-cream-100 hover:bg-cream-200 px-3 py-1 rounded-full text-xs font-semibold text-charcoal-800 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-lemon-400 text-lemon-400" />
                  <span>{product.rating}</span>
                  <span className="text-charcoal-400 font-normal">({product.reviewsCount} reviews)</span>
                </a>
              ) : (
                <span className="text-xs font-semibold text-charcoal-500 bg-cream-100 px-3 py-1 rounded-full">
                  No reviews yet
                </span>
              )}

              <span className="text-xs font-semibold text-leaf-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-leaf-600" /> {product.availability}
              </span>
            </div>

            {/* Short Description */}
            <p className="mt-4 text-base sm:text-lg text-charcoal-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* LKR Price Display */}
            <div className="mt-6 p-4 rounded-2xl bg-white border border-cream-200/90 shadow-soft-xs flex flex-wrap items-baseline gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-charcoal-500">LKR</span>
                <span className="font-display font-black text-3xl sm:text-4xl text-botanical-950 tracking-tight">
                  {product.price}
                </span>
              </div>

              {product.originalPrice && (
                <span className="text-sm sm:text-base text-charcoal-400 line-through">
                  LKR {product.originalPrice}
                </span>
              )}

              {product.originalPrice && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-ginger-100 text-ginger-700 border border-ginger-200">
                  Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}

              <span className="text-xs text-charcoal-500 ml-auto">
                {product.unitCost || product.unit}
              </span>
            </div>

            {/* Quantity Selector, Add to Cart & Buy Now */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between border border-cream-300 rounded-full bg-white px-3.5 py-2 w-32 shadow-soft-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-charcoal-700 hover:bg-cream-100 transition-colors"
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
                    className="w-7 h-7 rounded-full flex items-center justify-center text-charcoal-700 hover:bg-cream-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={adminPreview || !product.isAvailable}
                  variant="primary"
                  size="lg"
                  className="flex-1 shadow-soft"
                  leftIcon={<ShoppingBag className="w-5 h-5" />}
                >
                  Add to Cart &bull; LKR {(product.price * quantity).toLocaleString()}
                </Button>

                {/* Favorite Button */}
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  className={`p-3.5 rounded-full border transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-50 border-red-200 text-red-500 shadow-soft-xs' 
                      : 'bg-white border-cream-300 text-charcoal-400 hover:text-red-500 hover:bg-cream-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Button */}
              <Button
                onClick={handleBuyNow}
                disabled={adminPreview || !product.isAvailable}
                variant="ginger"
                size="lg"
                className="w-full shadow-ginger"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Buy Now &bull; Express Checkout
              </Button>
            </div>

            {/* Small Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-cream-200/90 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-cream-200/80">
                <Leaf className="w-4 h-4 text-leaf-600 shrink-0" />
                <span className="text-xs font-semibold text-botanical-950">Natural Ingredients</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-cream-200/80">
                <Pocket className="w-4 h-4 text-ginger-600 shrink-0" />
                <span className="text-xs font-semibold text-botanical-950">Easy to Carry</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-cream-200/80">
                <Coffee className="w-4 h-4 text-lemon-600 shrink-0" />
                <span className="text-xs font-semibold text-botanical-950">No Preparation</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-cream-200/80">
                <Clock className="w-4 h-4 text-botanical-800 shrink-0" />
                <span className="text-xs font-semibold text-botanical-950">Convenient Everyday Use</span>
              </div>
            </div>

            {/* Shipping & Delivery Reassurance */}
            <div className="mt-4 p-3.5 rounded-2xl bg-cream-100/70 border border-cream-200/90 flex items-center justify-between text-xs text-charcoal-600">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-ginger-600" />
                Free delivery on orders over LKR 2,000
              </span>
              <span className="font-semibold text-botanical-950">Delivers in 2–3 business days</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1 — DETAILED PRODUCT DESCRIPTION (flat editorial, no card chrome) */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-cream-200">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-botanical-950 mb-5">
          Product Description
        </h2>

        <p className="text-charcoal-600 whitespace-pre-line leading-relaxed">{product.description || "No description provided yet."}</p>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — KEY INGREDIENTS (Visually Rich)                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="ginger" size="md" dot className="mb-2">
            Ceylon Terroir
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-botanical-950">
            Key Botanical Ingredients
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{product.ingredients.map((ingredient, index) => <div key={index} className="bg-white rounded-4xl p-8 border border-cream-200 shadow-soft"><Leaf className="w-6 h-6 text-leaf-600 mb-4" /><h3 className="font-display font-bold text-xl text-botanical-950">{ingredient}</h3></div>)}</div>
        {!product.ingredients.length && <p className="text-center text-charcoal-500">Ingredient information has not been provided.</p>}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — HOW TO ENJOY                                                  */}
      {/* ========================================================================= */}


      {/* ========================================================================= */}
      {/* SECTION 4 — PRODUCT INFORMATION / SPECS TABLE (flat editorial, no card)   */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-cream-200">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-botanical-950 mb-6">
          Product Information
        </h2>

        <div className="divide-y divide-cream-200 text-sm">{[['Product Name', product.name], ['Category', product.category], ['Ingredients', product.ingredients.join(', ')], ['Availability', product.availability]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="py-4 flex justify-between gap-4"><span className="text-charcoal-500">{label}</span><span className="text-right font-semibold">{value}</span></div>)}</div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — FAQ ACCORDION                                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-4xl p-8 sm:p-12 border border-cream-200 shadow-soft">
          <div className="text-center max-w-xl mx-auto mb-8">
            <Badge variant="ginger" size="sm" dot className="mb-2">
              Common Questions
            </Badge>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-botanical-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-cream-200">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-display font-bold text-base sm:text-lg text-botanical-950 hover:text-ginger-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center shrink-0 text-charcoal-600">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-charcoal-600 leading-relaxed pr-8 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — CUSTOMER REVIEWS                                              */}
      {/* ========================================================================= */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <Badge variant="lemon" size="sm" dot className="mb-2">
            Verified Experiences
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-botanical-950">
            Customer Reviews
          </h2>
          <p className="mt-1 text-sm text-charcoal-600">
            Real feedback from teachers, singers, and daily commuters.
          </p>
        </div>

        <ProductReviews key={product.id} />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — RELATED PRODUCTS / COMING SOON                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-cream-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="leaf" size="sm" dot className="mb-1">
              Explore The Catalog
            </Badge>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-botanical-950">
              Related Formulations & Coming Soon
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-semibold text-ginger-700 hover:text-ginger-800 underline underline-offset-2 flex items-center gap-1"
          >
            View all collections &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.slice(0, 3).map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
