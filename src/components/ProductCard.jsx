import React from 'react';
import { Heart, ShoppingBag, Eye, Star, MessageCircle } from 'lucide-react';
import STORE_CONFIG from '../config';

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি RN Fashion BD House থেকে এই শাড়িটি অর্ডার করতে চাই:\n\n• শাড়ির নাম: ${product.name}\n• কোড: ${product.id}\n• মূল্য: ${STORE_CONFIG.currencySymbol}${product.price}\n• স্টক: ${product.inStock ? 'উপলব্ধ' : 'স্টক আউট'}`
  );

  return (
    <div className="group bg-white rounded-2xl border border-champagne/80 overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col h-full relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-sand/30 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-ink/90 text-gold text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shadow-sm border border-gold/30">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              -{discountPercent}% ছাড়
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-cream/90 hover:bg-cream text-ink flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 z-10"
          title="উইশলিস্টে যুক্ত করুন"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-cocoa'
            }`}
          />
        </button>

        {/* Overlay Quick View Button on Hover */}
        <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-cream/95 text-ink hover:text-gold px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>বিস্তারিত দেখুন</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Fabric */}
          <div className="flex items-center justify-between text-xs text-cocoa/80 mb-1">
            <span className="font-medium">{product.fabric}</span>
            <div className="flex items-center text-gold text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-gold text-gold mr-0.5" />
              <span>{product.rating}</span>
              <span className="text-cocoa/60 ml-0.5">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-display font-bold text-sm sm:text-base text-ink line-clamp-2 cursor-pointer hover:text-gold transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Color & Stock Info */}
          <p className="text-xs text-cocoa line-clamp-1 mt-1">
            রঙ: {product.color}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="pt-2 border-t border-champagne/40 space-y-2.5">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg sm:text-xl font-bold text-ink">
              {STORE_CONFIG.currencySymbol}{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-cocoa/60 line-through">
                {STORE_CONFIG.currencySymbol}{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Button Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                product.inStock
                  ? 'bg-ink hover:bg-ink/90 text-cream active:scale-95'
                  : 'bg-sand text-cocoa/50 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-gold" />
              <span>{product.inStock ? 'অর্ডার করুন' : 'স্টক শেষ'}</span>
            </button>

            <a
              href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2 rounded-xl text-xs font-medium bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center space-x-1 border border-[#25D366]/30 transition-all active:scale-95"
              title="WhatsApp এ সরাসরি কথা বলুন বা অর্ডার দিন"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;
