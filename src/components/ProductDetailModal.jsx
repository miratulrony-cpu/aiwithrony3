import React, { useState } from 'react';
import { X, Heart, ShoppingBag, MessageCircle, Star, Check, ShieldCheck, Truck } from 'lucide-react';
import STORE_CONFIG from '../config';

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
  isWishlisted,
  onToggleWishlist
}) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি RN Fashion BD House থেকে এই শাড়িটি অর্ডার করতে আগ্রহী:\n\n• শাড়ি: ${product.name}\n• কোড: ${product.id}\n• পরিমাণ: ${quantity} টি\n• মোট মূল্য: ${STORE_CONFIG.currencySymbol}${(product.price * quantity).toLocaleString('en-IN')}\n\nঅনুগ্রহ করে ডেলিভারি কনফার্ম করুন।`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-ink/60 backdrop-blur-sm animate-fadeUp">
      <div
        className="relative bg-cream w-full max-w-4xl rounded-3xl border border-champagne shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-sand/80 hover:bg-sand text-ink flex items-center justify-center transition-colors shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          
          {/* Images Section */}
          <div className="p-6 bg-sand/30 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-champagne/60">
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-sm border border-champagne/60 relative">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-ink/90 text-gold text-xs font-bold px-2.5 py-1 rounded-md shadow">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {imagesList.length > 1 && (
              <div className="flex gap-2.5 mt-4 w-full overflow-x-auto pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === img ? 'border-gold shadow-md scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-cocoa">
                <span className="bg-champagne/60 px-2.5 py-1 rounded-full font-medium">
                  {product.fabric}
                </span>
                <div className="flex items-center text-gold font-bold">
                  <Star className="w-3.5 h-3.5 fill-gold text-gold mr-1" />
                  <span>{product.rating}</span>
                  <span className="text-cocoa/60 ml-1">({product.reviewsCount} টি রিভিউ)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-bold text-ink">
                  {STORE_CONFIG.currencySymbol}{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-cocoa/60 line-through">
                    {STORE_CONFIG.currencySymbol}{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% সাশ্রয়
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-cocoa leading-relaxed">
                {product.description}
              </p>

              {/* Specs Grid */}
              <div className="bg-white/80 rounded-2xl p-4 border border-champagne/60 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-cocoa/70 block">রং ও শেড:</span>
                    <span className="font-semibold text-ink">{product.color}</span>
                  </div>
                  <div>
                    <span className="text-cocoa/70 block">ব্লাউজ পিস:</span>
                    <span className="font-semibold text-ink">{product.blousePiece}</span>
                  </div>
                  <div>
                    <span className="text-cocoa/70 block">শাড়ির বহর/দৈর্ঘ্য:</span>
                    <span className="font-semibold text-ink">{product.length}</span>
                  </div>
                  <div>
                    <span className="text-cocoa/70 block">ধোয়া ও যত্ন:</span>
                    <span className="font-semibold text-ink">{product.care}</span>
                  </div>
                </div>
              </div>

              {/* Stock info */}
              <div className="text-xs flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="font-medium text-cocoa">
                  {product.inStock ? `ইন-স্টক (অর্ডার করতে পারেন)` : 'বর্তমানে স্টক নেই'}
                </span>
              </div>

            </div>

            {/* Actions Area */}
            <div className="space-y-3 pt-4 border-t border-champagne/60">
              
              {/* Quantity selector */}
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-cocoa">পরিমাণ:</span>
                <div className="flex items-center border border-champagne rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-ink hover:bg-sand text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-ink">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-ink hover:bg-sand text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-2 rounded-xl border border-champagne transition-colors ${
                    isWishlisted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-cocoa hover:text-ink'
                  }`}
                  title="পছন্দের তালিকায় রাখুন"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className="w-full bg-ink hover:bg-ink/90 text-cream py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>ব্যাগে যোগ হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-gold" />
                      <span>ব্যাগে রাখুন</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onInstantBuy(product, quantity)}
                  disabled={!product.inStock}
                  className="w-full bg-gold hover:bg-gold/90 text-ink py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  এখনই অর্ডার করুন
                </button>
              </div>

              {/* WhatsApp direct order */}
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center space-x-2 border border-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp এ সরাসরি নিশ্চিত করুন</span>
              </a>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetailModal;
