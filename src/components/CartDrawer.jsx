import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, MessageCircle, Tag, Truck } from 'lucide-react';
import STORE_CONFIG from '../config';

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess
}) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [deliveryZone, setDeliveryZone] = useState('inside'); // 'inside' or 'outside'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  // Calculation
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const deliveryFee = subtotal >= STORE_CONFIG.delivery.freeDeliveryThreshold
    ? 0
    : deliveryZone === 'inside'
    ? STORE_CONFIG.delivery.insideDhaka
    : STORE_CONFIG.delivery.outsideDhaka;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const freeDeliveryRemaining = Math.max(0, STORE_CONFIG.delivery.freeDeliveryThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    const found = STORE_CONFIG.coupons.find((c) => c.code === code);

    if (!found) {
      setCouponError('কুপন কোডটি সঠিক নয়');
      return;
    }

    if (subtotal < found.minOrder) {
      setCouponError(`এই কুপন ব্যবহারের জন্য ন্যূনতম ৳${found.minOrder.toLocaleString('en-IN')} টাকার অর্ডার প্রয়োজন`);
      return;
    }

    setAppliedCoupon(found);
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const errors = {};
    if (!customerName.trim()) errors.name = 'নাম লিখুন';
    if (!customerPhone.trim() || customerPhone.length < 11) errors.phone = 'সঠিক মোবাইল নাম্বার দিন (১১ ডিজিট)';
    if (!customerAddress.trim()) errors.address = 'সম্পূর্ণ ঠিকানা লিখুন';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const orderId = `RN-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        notes: customerNotes
      },
      deliveryZone: deliveryZone === 'inside' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে',
      deliveryFee,
      items: cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        total: i.product.price * i.quantity
      })),
      subtotal,
      discount: discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      grandTotal,
      paymentMethod,
      status: 'Pending'
    };

    // Save order in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('rn_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('rn_orders', JSON.stringify(existing));
    } catch {
      // Storage unavailable fallback
    }

    setConfirmedOrder(newOrder);
    onClearCart();
    if (onOrderSuccess) onOrderSuccess(newOrder);
  };

  const generateWhatsAppInvoiceMessage = () => {
    if (!confirmedOrder) return '';
    const itemLines = confirmedOrder.items
      .map((it) => `• ${it.name} (পরিমাণ: ${it.quantity} টি) - ৳${it.total.toLocaleString('en-IN')}`)
      .join('\n');

    return encodeURIComponent(
      `🛍️ *RN Fashion BD House — নতুন অর্ডার*\n\n` +
      `*অর্ডার আইডি:* #${confirmedOrder.id}\n` +
      `*তারিখ:* ${new Date().toLocaleDateString('bn-BD')}\n\n` +
      `*কাস্টমার ডিটেইলস:*\n` +
      `নাম: ${confirmedOrder.customer.name}\n` +
      `ফোন: ${confirmedOrder.customer.phone}\n` +
      `ঠিকানা: ${confirmedOrder.customer.address}\n` +
      `এলাকা: ${confirmedOrder.deliveryZone}\n` +
      (confirmedOrder.customer.notes ? `নোট: ${confirmedOrder.customer.notes}\n` : '') +
      `\n*অর্ডারকৃত শাড়ি:*\n${itemLines}\n\n` +
      `সাব-টোটাল: ৳${confirmedOrder.subtotal.toLocaleString('en-IN')}\n` +
      (confirmedOrder.discount > 0 ? `ছাড় (${confirmedOrder.couponCode}): -৳${confirmedOrder.discount.toLocaleString('en-IN')}\n` : '') +
      `ডেলিভারি চার্জ: ৳${confirmedOrder.deliveryFee.toLocaleString('en-IN')}\n` +
      `*সর্বমোট প্রদেয়:* ৳${confirmedOrder.grandTotal.toLocaleString('en-IN')}\n` +
      `পেমেন্ট পদ্ধতি: ${confirmedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : confirmedOrder.paymentMethod.toUpperCase()}\n\n` +
      `দয়া করে আমার অর্ডারটি কনফার্ম করুন। ধন্যবাদ!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-cream border-l border-champagne shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-champagne flex items-center justify-between bg-sand/40">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="font-display font-bold text-lg text-ink">
                শপিং ব্যাগ ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-champagne/60 text-cocoa hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">

            {/* CONFIRMED ORDER SUCCESS SCREEN */}
            {confirmedOrder ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display font-bold text-ink">
                  অর্ডার সফলভাবে গৃহীত হয়েছে!
                </h3>
                <p className="text-xs text-cocoa">
                  আপনার অর্ডার আইডি: <strong className="text-ink font-mono text-sm">#{confirmedOrder.id}</strong>
                </p>
                <div className="bg-white/90 border border-champagne rounded-2xl p-4 text-left text-xs space-y-2 text-cocoa">
                  <div className="flex justify-between font-bold text-ink border-b border-champagne/60 pb-2">
                    <span>প্রাপক: {confirmedOrder.customer.name}</span>
                    <span>ফোন: {confirmedOrder.customer.phone}</span>
                  </div>
                  <p>ঠিকানা: {confirmedOrder.customer.address}</p>
                  <p className="font-semibold text-ink">সর্বমোট: ৳{confirmedOrder.grandTotal.toLocaleString('en-IN')} ({confirmedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন'})</p>
                </div>

                <div className="pt-2 space-y-2">
                  <a
                    href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${generateWhatsAppInvoiceMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp এ অর্ডার নিশ্চিত করুন</span>
                  </a>

                  <button
                    onClick={() => {
                      setConfirmedOrder(null);
                      setIsCheckingOut(false);
                      onClose();
                    }}
                    className="w-full bg-ink text-cream py-2.5 rounded-xl text-xs font-semibold hover:bg-ink/90 transition-colors"
                  >
                    আরো শপিং করুন
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              /* EMPTY CART */
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-sand/60 flex items-center justify-center mx-auto text-cocoa">
                  <ShoppingBag className="w-10 h-10 opacity-40" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink">
                  আপনার ব্যাগ বর্তমানে খালি
                </h3>
                <p className="text-xs text-cocoa max-w-xs mx-auto">
                  আমাদের মনোমুগ্ধকর শাড়ির সংগ্রহ থেকে আপনার পছন্দের শাড়িটি ব্যাগে যুক্ত করুন।
                </p>
                <button
                  onClick={onClose}
                  className="bg-gold text-ink font-semibold px-6 py-2.5 rounded-full text-xs shadow-sm hover:bg-gold/90 transition-colors"
                >
                  শাড়ি দেখুন
                </button>
              </div>
            ) : !isCheckingOut ? (
              /* CART ITEMS VIEW */
              <>
                {/* Free Delivery Bar */}
                <div className="bg-sand/60 rounded-xl p-3 border border-champagne text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1 font-medium text-ink">
                      <Truck className="w-3.5 h-3.5 text-gold" />
                      {freeDeliveryRemaining === 0 ? 'ফ্রি ডেলিভারি প্রযোজ্য!' : `ফ্রি ডেলিভারির জন্য আর মাত্র ৳${freeDeliveryRemaining.toLocaleString('en-IN')} টাকার শপিং`}
                    </span>
                    <span className="font-bold text-cocoa">
                      {Math.min(100, Math.round((subtotal / STORE_CONFIG.delivery.freeDeliveryThreshold) * 100))}%
                    </span>
                  </div>
                  <div className="w-full bg-champagne h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gold h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / STORE_CONFIG.delivery.freeDeliveryThreshold) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-champagne/60">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-3 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded-xl border border-champagne/60 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-ink truncate" title={item.product.name}>
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-cocoa">
                          {STORE_CONFIG.currencySymbol}{item.product.price.toLocaleString('en-IN')} x {item.quantity}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 pt-1">
                          <div className="flex items-center border border-champagne rounded-lg bg-white overflow-hidden text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 hover:bg-sand text-ink font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold text-ink">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-sand text-ink font-bold"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-red-500/70 hover:text-red-600 p-1"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-ink">
                          {STORE_CONFIG.currencySymbol}{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="bg-white/80 rounded-2xl p-3 border border-champagne/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span>ডিসকাউন্ট কুপন</span>
                  </div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-gold/15 border border-gold/40 rounded-xl px-3 py-2 text-xs">
                      <div>
                        <span className="font-bold text-ink">{appliedCoupon.code}</span>
                        <span className="text-cocoa ml-1">({appliedCoupon.description})</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-600 font-bold hover:underline text-[11px]"
                      >
                        বাতিল
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="কুপন কোড (যেমন: EID2026)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-champagne focus:outline-none focus:ring-1 focus:ring-gold bg-sand/30"
                      />
                      <button
                        type="submit"
                        className="bg-ink hover:bg-ink/90 text-cream text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors"
                      >
                        প্রয়োগ
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </div>
              </>
            ) : (
              /* CHECKOUT FORM VIEW */
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-cocoa hover:text-ink font-semibold flex items-center gap-1 mb-2"
                >
                  ← ব্যাগে ফিরে যান
                </button>

                <h3 className="font-display font-bold text-base text-ink border-b border-champagne pb-2">
                  ডেলিভারি ও কাস্টমার তথ্য
                </h3>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    আপনার সম্পূর্ণ নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="উদা: সাদিয়া ইসলাম"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne bg-white focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  {formErrors.name && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    মোবাইল নাম্বার <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="০১৭১২-৩৪৫৬৭৮"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne bg-white focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  {formErrors.phone && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.phone}</p>}
                </div>

                {/* Delivery Zone */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    ডেলিভারি এলাকা <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeliveryZone('inside')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        deliveryZone === 'inside'
                          ? 'border-gold bg-gold/15 font-bold text-ink'
                          : 'border-champagne bg-white text-cocoa'
                      }`}
                    >
                      <div>ঢাকার ভেতরে</div>
                      <div className="text-[11px] text-cocoa/80">
                        {subtotal >= STORE_CONFIG.delivery.freeDeliveryThreshold ? 'ফ্রি ডেলিভারি' : `৳${STORE_CONFIG.delivery.insideDhaka}`}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryZone('outside')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        deliveryZone === 'outside'
                          ? 'border-gold bg-gold/15 font-bold text-ink'
                          : 'border-champagne bg-white text-cocoa'
                      }`}
                    >
                      <div>ঢাকার বাইরে</div>
                      <div className="text-[11px] text-cocoa/80">
                        {subtotal >= STORE_CONFIG.delivery.freeDeliveryThreshold ? 'ফ্রি ডেলিভারি' : `৳${STORE_CONFIG.delivery.outsideDhaka}`}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    পূর্ণ ডেলিভারি ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="বাসা/হোল্ডিং নম্বর, রোড, এলাকা, থানা ও জেলা..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne bg-white focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  {formErrors.address && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.address}</p>}
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    বিশেষ নির্দেশনা (যদি থাকে)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: দ্রুত ডেলিভারি দিন বা উপহারের প্যাকেট করবেন"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-champagne bg-white focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Payment Option */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    পেমেন্ট মেথড
                  </label>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-champagne cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-gold"
                      />
                      <span className="font-medium text-ink">ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-champagne cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="accent-gold"
                      />
                      <span className="font-medium text-ink">বিকাশ সেন্ড মানি (bKash: <strong className="text-gold font-mono">{STORE_CONFIG.bkashNumber}</strong>)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-champagne cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="accent-gold"
                      />
                      <span className="font-medium text-ink">নগদ সেন্ড মানি (Nagad: <strong className="text-gold font-mono">{STORE_CONFIG.nagadNumber}</strong>)</span>
                    </label>
                  </div>
                </div>

              </form>
            )}

          </div>

          {/* Footer Totals & Checkout Button */}
          {!confirmedOrder && cart.length > 0 && (
            <div className="p-5 border-t border-champagne bg-sand/30 space-y-3">
              <div className="space-y-1.5 text-xs text-cocoa">
                <div className="flex justify-between">
                  <span>সাব-টোটাল:</span>
                  <span className="font-semibold text-ink">{STORE_CONFIG.currencySymbol}{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>কুপন ছাড় ({appliedCoupon?.code}):</span>
                    <span>-{STORE_CONFIG.currencySymbol}{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-semibold text-ink">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">ফ্রি!</span> : `${STORE_CONFIG.currencySymbol}${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-ink border-t border-champagne pt-1.5">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-gold text-base">{STORE_CONFIG.currencySymbol}{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!isCheckingOut ? (
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-gold hover:bg-gold/90 text-ink py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <span>চেকআউট করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-ink hover:bg-ink/90 text-cream py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <span>অর্ডার নিশ্চিত করুন</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
