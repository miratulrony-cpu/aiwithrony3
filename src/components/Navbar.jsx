import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import STORE_CONFIG from '../config';

export function Navbar({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
  activeCategory,
  onSelectCategory,
  currentRoute,
  onNavigate
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-champagne shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-ink text-champagne text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            <span className="font-medium">
              প্রিমিয়াম শাড়িতে বিশেষ অফার! কুপন কোড <strong className="text-gold tracking-wider">EID2026</strong> ব্যবহারে ১০% ছাড়!
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello RN Fashion BD House, I would like to inquire about your saree collections.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>WhatsApp: {STORE_CONFIG.whatsappDisplay}</span>
            </a>
            <span className="hidden sm:inline opacity-40">|</span>
            <button
              onClick={() => onNavigate('#/admin')}
              className="text-champagne/80 hover:text-gold text-xs underline underline-offset-2 transition-colors"
            >
              {currentRoute === '#/admin' ? 'দোকানে ফিরুন (Store)' : 'এডমিন (Admin)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('#/')}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-champagne p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-ink rounded-full flex flex-col items-center justify-center text-gold">
                <span className="font-display font-bold text-lg leading-none">RN</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
                  {STORE_CONFIG.name}
                </span>
                <Sparkles className="w-4 h-4 text-gold fill-gold/30" />
              </div>
              <p className="text-xs text-cocoa font-medium tracking-wide">
                {STORE_CONFIG.tagline}
              </p>
            </div>
          </div>

          {/* Search bar on desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="শাড়ির নাম, রঙ বা ফেব্রিক খুঁজুন (যেমন: জামদানি, কাতান, সিল্ক)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-champagne bg-sand/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:bg-white transition-all text-ink placeholder:text-cocoa/60"
              />
              <Search className="w-4 h-4 text-cocoa absolute left-3.5 top-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs text-cocoa hover:text-ink font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-cocoa hover:text-ink rounded-full hover:bg-champagne/40"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-cocoa hover:text-ink rounded-full hover:bg-champagne/40 transition-colors"
              title="পছন্দের তালিকা (Wishlist)"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cocoa text-cream text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-cream">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-ink hover:bg-ink/90 text-cream px-3.5 py-2 rounded-full shadow-soft transition-all hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-gold" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-champagne">
                {cartTotal > 0 ? `${STORE_CONFIG.currencySymbol}${cartTotal.toLocaleString('en-IN')}` : 'ব্যাগ (Bag)'}
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-cocoa hover:text-ink rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search input expandable */}
        {showSearch && (
          <div className="md:hidden pb-4 pt-1">
            <div className="relative">
              <input
                type="text"
                placeholder="শাড়ির নাম বা ফ্যাব্রিক খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-champagne bg-sand/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Search className="w-4 h-4 text-cocoa absolute left-3.5 top-3" />
            </div>
          </div>
        )}

        {/* Navigation Categories Desktop */}
        <div className="hidden md:flex items-center space-x-8 py-2.5 border-t border-champagne/40 text-sm font-medium">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors pb-1 border-b-2 ${
              activeCategory === 'all'
                ? 'border-gold text-ink font-semibold'
                : 'border-transparent text-cocoa hover:text-ink'
            }`}
          >
            সকল শাড়ি (All)
          </button>
          <button
            onClick={() => onSelectCategory('banarasi')}
            className={`transition-colors pb-1 border-b-2 ${
              activeCategory === 'banarasi'
                ? 'border-gold text-ink font-semibold'
                : 'border-transparent text-cocoa hover:text-ink'
            }`}
          >
            বেনারসি ও কাতান
          </button>
          <button
            onClick={() => onSelectCategory('jamdani')}
            className={`transition-colors pb-1 border-b-2 ${
              activeCategory === 'jamdani'
                ? 'border-gold text-ink font-semibold'
                : 'border-transparent text-cocoa hover:text-ink'
            }`}
          >
            ঢাকাই জামদানি
          </button>
          <button
            onClick={() => onSelectCategory('silk')}
            className={`transition-colors pb-1 border-b-2 ${
              activeCategory === 'silk'
                ? 'border-gold text-ink font-semibold'
                : 'border-transparent text-cocoa hover:text-ink'
            }`}
          >
            রাজশাহী সিল্ক
          </button>
          <button
            onClick={() => onSelectCategory('cotton')}
            className={`transition-colors pb-1 border-b-2 ${
              activeCategory === 'cotton'
                ? 'border-gold text-ink font-semibold'
                : 'border-transparent text-cocoa hover:text-ink'
            }`}
          >
            টাঙ্গাইল তাঁত সুতি
          </button>
          <button
            onClick={() => onSelectCategory('party')}
            className={`transition-colors pb-1 border-b-2 ${
              activeCategory === 'party'
                ? 'border-gold text-ink font-semibold'
                : 'border-transparent text-cocoa hover:text-ink'
            }`}
          >
            পার্টি কালেকশন
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-champagne px-4 pt-2 pb-6 space-y-3">
          <div className="font-semibold text-xs text-cocoa uppercase tracking-wider mb-2">
            কালেকশন ক্যাটাগরি
          </div>
          {[
            { id: 'all', label: 'সকল শাড়ি (All)' },
            { id: 'banarasi', label: 'বেনারসি ও কাতান' },
            { id: 'jamdani', label: 'ঢাকাই জামদানি' },
            { id: 'silk', label: 'রাজশাহী সিল্ক' },
            { id: 'cotton', label: 'টাঙ্গাইল তাঁত সুতি' },
            { id: 'party', label: 'পার্টি শাড়ি' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg text-sm ${
                activeCategory === cat.id
                  ? 'bg-gold/20 text-ink font-bold'
                  : 'text-cocoa hover:bg-champagne/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <div className="pt-3 border-t border-champagne flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('#/admin');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 text-sm text-gold font-bold hover:underline"
            >
              এডমিন প্যানেল (Admin Panel)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
