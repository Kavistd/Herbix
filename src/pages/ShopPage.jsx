import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import ProductCard from '../components/cards/ProductCard';
import QuickViewModal from '../components/shop/QuickViewModal';
import { useProducts } from '../context/ProductContext';
import ProductState from '../components/common/ProductState';
import { useCart } from '../context/CartContext';

export default function ShopPage() {
  const { products: PRODUCTS, loading, error, refresh } = useProducts();
  const CATEGORIES = [...new Set(["All", "Available Now", "Coming Soon", ...PRODUCTS.map(p => p.category).filter(Boolean)])];
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState([]); // default favorite
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { addItem } = useCart();

  // Favorite toggle handler
  const handleToggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      // Category filter
      let matchesCategory = true;
      if (selectedCategory === 'Available Now') {
        matchesCategory = product.isAvailable === true;
      } else if (selectedCategory === 'Coming Soon') {
        matchesCategory = product.isComingSoon === true;
      } else if (selectedCategory !== 'All') {
        matchesCategory = product.category === selectedCategory;
      }

      // Search query filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        product.name.toLowerCase().includes(query) ||
        product.subtitle.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.ingredients.some(ing => ing.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'featured') result.sort((a, b) => Number(b.featured) - Number(a.featured));
    // Sort logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [PRODUCTS, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="w-full bg-cream-50 min-h-screen pb-20">
      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-cream-200/80 bg-gradient-to-b from-white/70 to-cream-50">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="leaf" size="md" dot className="mb-3">
            Pure Ceylon Botanicals
          </Badge>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-botanical-950 tracking-tight">
            Shop Herbix
          </h1>
          <p className="mt-3 text-base sm:text-lg text-charcoal-600 max-w-xl mx-auto leading-relaxed">
            Everyday herbal comfort, made simple.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONTROLS TOOLBAR: CATEGORY PILLS, SEARCH, SORT & RESULTS COUNT            */}
      {/* ========================================================================= */}
      <section className="sticky top-[68px] z-30 bg-cream-50/95 backdrop-blur-md border-b border-cream-200/80 py-4 px-4 sm:px-6 lg:px-8 shadow-soft-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none select-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  selectedCategory === category
                    ? 'bg-botanical-900 text-cream-50 shadow-soft'
                    : 'bg-white text-charcoal-700 hover:bg-cream-200/80 border border-cream-200/90'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search, Sort and Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search variants, spices..."
                className="w-full bg-white text-charcoal-900 placeholder:text-charcoal-400 pl-10 pr-8 py-2 rounded-full text-xs border border-cream-300 focus:outline-none focus:border-leaf-600 focus:ring-2 focus:ring-leaf-500/15 shadow-soft-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-cream-300 shadow-soft-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-500 shrink-0" />
              <label htmlFor="sort-select" className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider hidden sm:inline">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-botanical-950 focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A–Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* RESULTS COUNT & ACTIVE FILTER PILLS                                       */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-charcoal-600">
          <span className="font-semibold text-botanical-950">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
          {selectedCategory !== 'All' && (
            <span className="bg-leaf-100 text-leaf-800 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              Category: {selectedCategory}
              <button 
                type="button" 
                onClick={() => setSelectedCategory('All')} 
                className="hover:text-leaf-950"
                aria-label="Remove category filter"
              >
                &times;
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="bg-ginger-100 text-ginger-800 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              Query: "{searchQuery}"
              <button 
                type="button" 
                onClick={() => setSearchQuery('')} 
                className="hover:text-ginger-950"
                aria-label="Remove search filter"
              >
                &times;
              </button>
            </span>
          )}
        </div>

        {(selectedCategory !== 'All' || searchQuery || sortBy !== 'featured') && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-ginger-700 hover:text-ginger-800 font-semibold underline underline-offset-2"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRODUCTS GRID                                                             */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading || error ? <ProductState loading={loading} error={error} retry={refresh} /> : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-20 text-center bg-white rounded-4xl border border-cream-200 p-8 shadow-soft max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-cream-100 flex items-center justify-center text-ginger-600 mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="font-display font-bold text-2xl text-botanical-950">
              No matching herbal bites found
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-2 leading-relaxed">
              We couldn't find any formulations matching your filter criteria. Try searching for "Ginger", "Lemon", or reset your filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 rounded-full bg-botanical-900 text-cream-50 text-xs font-semibold hover:bg-botanical-800 transition-colors shadow-soft"
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Informative Note regarding Coming Soon Prototypes */}
        <div className="mt-16 p-6 rounded-3xl bg-cream-100/70 border border-cream-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-botanical-900 text-lemon-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-botanical-950">
                Crafting New Ceylon Herbal Formulations
              </h4>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Variants marked with <strong>Coming Soon</strong> are still being refined. Click "Preview" to join the early drop notification list.
              </p>
            </div>
          </div>
          <Badge variant="ginger" size="sm">
            Future Releases
          </Badge>
        </div>

        {/* ========================================================================= */}
        {/* TRUST / REASSURANCE STRIP — flat divider row, not another shadow card     */}
        {/* ========================================================================= */}
        <div className="mt-14 pt-10 border-t border-cream-200 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          <div className="flex items-center gap-3.5">
            <Truck className="w-5 h-5 text-ginger-600 shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-botanical-950">Islandwide Priority Dispatch</h4>
              <p className="text-xs text-charcoal-500">Free delivery on orders above LKR 2,000 across Sri Lanka.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-5 h-5 text-leaf-600 shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-botanical-950">Traditional Herbal Ingredients</h4>
              <p className="text-xs text-charcoal-500">Ginger, lemon and black pepper — no synthetic additives.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <RefreshCw className="w-5 h-5 text-lemon-600 shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-botanical-950">Convenient Herbal Comfort</h4>
              <p className="text-xs text-charcoal-500">A refreshing ginger, lemon and black pepper blend, ready whenever you are.</p>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* QUICK VIEW MODAL COMPONENT                                                */}
      {/* ========================================================================= */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(prod, qty) => addItem(prod, qty)}
        isFavorite={quickViewProduct ? favorites.includes(quickViewProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
