import React, { useState, useEffect, useMemo } from 'react';
import STORE_CONFIG from './config';
import { INITIAL_PRODUCTS, CATEGORIES } from './data/products';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { Sparkles, SlidersHorizontal, Heart, Phone, CheckCircle, Tag } from 'lucide-react';

export function App() {
  // Products State
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('rn_products');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('rn_cart');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Wishlist State (list of IDs)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('rn_wishlist');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Filter & Search
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Hash Routing (#/admin or #/)
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Sync products changes to localStorage
  const handleUpdateProducts = (updated) => {
    setProducts(updated);
    try {
      localStorage.setItem('rn_products', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast('ইনভেন্টরি আপডেট করা হয়েছে!');
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rn_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rn_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Hash routing listener
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (hash) => {
    window.location.hash = hash;
    setCurrentRoute(hash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.name.slice(0, 20)}..." ব্যাগে যোগ করা হয়েছে!`);
  };

  const handleInstantBuy = (product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('পণ্যটি ব্যাগ থেকে সরানো হয়েছে');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('পছন্দের তালিকা থেকে সরানো হয়েছে');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('পছন্দের তালিকায় যুক্ত হয়েছে!');
        return [...prev, productId];
      }
    });
  };

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Wishlist only filter
    if (showWishlistOnly) {
      result = result.filter((p) => wishlist.includes(p.id));
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy, showWishlistOnly, wishlist]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink font-body">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-cream px-4 py-3 rounded-2xl shadow-2xl border border-gold/40 flex items-center space-x-2 text-xs font-semibold animate-fadeUp">
          <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          setShowWishlistOnly(!showWishlistOnly);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setShowWishlistOnly(false);
          if (currentRoute !== '#/') navigateTo('#/');
        }}
        currentRoute={currentRoute}
        onNavigate={navigateTo}
      />

      {/* Main Content Router */}
      {currentRoute === '#/admin' ? (
        <main className="flex-1">
          <AdminPanel
            products={products}
            onUpdateProducts={handleUpdateProducts}
            onNavigateHome={() => navigateTo('#/')}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero Banner */}
          {!searchQuery && !showWishlistOnly && (
            <HeroBanner
              onExploreCategory={(cat) => {
                setActiveCategory(cat);
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* Saree Catalog Section */}
          <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-champagne">
              <div>
                <div className="flex items-center space-x-2 text-gold text-xs font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {showWishlistOnly ? 'পছন্দের শাড়ির তালিকা' : 'প্রিমিয়াম শাড়ির সংগ্রহ'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                  {showWishlistOnly
                    ? 'আপনার পছন্দের শাড়িসমূহ'
                    : activeCategory === 'all'
                    ? 'সকল এক্সক্লুসিভ কালেকশন'
                    : CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </h2>
                <p className="text-xs text-cocoa mt-1">
                  মোট {filteredProducts.length} টি শাড়ি প্রদর্শিত হচ্ছে
                </p>
              </div>

              {/* Controls: Category Pills & Sort */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Wishlist filter badge */}
                {showWishlistOnly && (
                  <button
                    onClick={() => setShowWishlistOnly(false)}
                    className="bg-sand text-cocoa hover:text-ink text-xs px-3 py-1.5 rounded-full font-semibold border border-champagne flex items-center gap-1"
                  >
                    <span>সকল শাড়ি দেখুন</span>
                    <span>✕</span>
                  </button>
                )}

                {/* Sort selector */}
                <div className="flex items-center space-x-2 bg-white rounded-xl border border-champagne px-3 py-1.5 shadow-sm text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cocoa" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-medium text-ink focus:outline-none cursor-pointer"
                  >
                    <option value="featured">বাছাইকৃত (Featured)</option>
                    <option value="price-low">দাম: কম থেকে বেশি</option>
                    <option value="price-high">দাম: বেশি থেকে কম</option>
                    <option value="rating">সেরা রেটিং (Top Rated)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Pills (Mobile & Desktop) */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setShowWishlistOnly(false);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id && !showWishlistOnly
                      ? 'bg-ink text-gold font-bold shadow-sm'
                      : 'bg-white/80 hover:bg-champagne/40 text-cocoa border border-champagne'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white/60 rounded-3xl border border-champagne p-8">
                <div className="w-16 h-16 rounded-full bg-sand/60 text-cocoa flex items-center justify-center mx-auto mb-3">
                  <Tag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-lg font-display font-bold text-ink mb-1">
                  কোনো শাড়ি পাওয়া যায়নি
                </h3>
                <p className="text-xs text-cocoa max-w-sm mx-auto mb-4">
                  আপনার অনুসন্ধান অনুযায়ী কোনো শাড়ি পাওয়া যায়নি। অন্য কি-ওয়ার্ড দিয়ে খুঁজুন অথবা ক্যাটাগরি পরিবর্তন করুন।
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setShowWishlistOnly(false);
                  }}
                  className="bg-gold text-ink text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:bg-gold/90 transition-colors"
                >
                  সব কালেকশন দেখুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onQuickView={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}

          </section>

          {/* Eid & Festive Special Promo Banner */}
          <section className="bg-sand/40 border-y border-champagne py-12">
            <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
              <span className="bg-gold/20 text-ink border border-gold/40 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                সীমিত সময়ের অফার
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                যেকোনো শাড়ির অর্ডারে পাচ্ছেন নিশ্চিত ক্যাশ অন ডেলিভারি
              </h3>
              <p className="text-xs sm:text-sm text-cocoa max-w-xl mx-auto leading-relaxed">
                পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন। ঢাকার ভিতরে ডেলিভারি চার্জ মাত্র ৳৮০ এবং ঢাকার বাইরে ৳১৫০। ৳৫,০০০ টাকার বেশি অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!
              </p>
              <div className="pt-2 flex justify-center">
                <a
                  href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-ink hover:bg-ink/90 text-gold font-semibold text-xs px-6 py-3 rounded-full shadow-soft flex items-center space-x-2 transition-transform hover:scale-105"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার: {STORE_CONFIG.phone}</span>
                </a>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setShowWishlistOnly(false);
          navigateTo('#/');
        }}
        onNavigate={navigateTo}
      />

      {/* Cart Drawer & Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderSuccess={(ord) => {
          showToast(`অর্ডার #${ord.id} সফলভাবে সম্পন্ন হয়েছে!`);
        }}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

    </div>
  );
}

export default App;
