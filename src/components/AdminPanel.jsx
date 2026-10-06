import React, { useState, useEffect } from 'react';
import { Shield, Lock, Package, ShoppingBag, Settings, LogOut, Plus, Trash2, Edit3, CheckCircle, Clock, Truck, Check } from 'lucide-react';
import STORE_CONFIG from '../config';

export function AdminPanel({
  products,
  onUpdateProducts,
  onNavigateHome
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'settings'

  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'banarasi',
    price: '',
    originalPrice: '',
    fabric: '',
    color: '',
    blousePiece: 'ব্লাউজ পিস অন্তর্ভুক্ত',
    length: '১২ হাত',
    care: 'ড্রাই ক্লিন',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: '',
    inStock: true
  });

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('rn_orders') || '[]');
      setOrders(stored);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcodeInput.trim() === STORE_CONFIG.adminPasscode) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(`পাসকোডটি সঠিক নয়। ডিফল্ট পাসকোড: ${STORE_CONFIG.adminPasscode}`);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
    setOrders(updated);
    try {
      localStorage.setItem('rn_orders', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (!window.confirm('এই অর্ডারটি মুছে ফেলতে চান?')) return;
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    try {
      localStorage.setItem('rn_orders', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStock = (productId) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p));
    onUpdateProducts(updated);
  };

  const handleDeleteProduct = (productId) => {
    if (!window.confirm('এই শাড়িটি রিমুভ করতে চান?')) return;
    const updated = products.filter((p) => p.id !== productId);
    onUpdateProducts(updated);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const created = {
      ...newProduct,
      id: `rn-${Date.now().toString().slice(-4)}`,
      price: Number(newProduct.price) || 2000,
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) || 2500,
      rating: 5.0,
      reviewsCount: 1,
      images: [newProduct.image]
    };
    onUpdateProducts([created, ...products]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: 'banarasi',
      price: '',
      originalPrice: '',
      fabric: '',
      color: '',
      blousePiece: 'ব্লাউজ পিস অন্তর্ভুক্ত',
      length: '১২ হাত',
      care: 'ড্রাই ক্লিন',
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      description: '',
      inStock: true
    });
  };

  // PASSCODE LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-champagne p-8 max-w-md w-full shadow-soft text-center space-y-6">
          <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-ink">RN Fashion এডমিন প্যানেল</h2>
            <p className="text-xs text-cocoa mt-1">
              স্টোর ম্যানেজমেন্ট এবং কাস্টমার অর্ডার দেখতে পাসকোড দিন।
            </p>
            <p className="text-[11px] text-cocoa/60 font-mono mt-1">
              (README/config.js পাসকোড: <strong className="text-gold">{STORE_CONFIG.adminPasscode}</strong>)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="পাসকোড লিখুন..."
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-champagne text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-gold bg-sand/30"
              autoFocus
            />
            {authError && <p className="text-xs text-red-600">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-ink hover:bg-ink/90 text-cream py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
            >
              লগইন করুন
            </button>
          </form>

          <button
            onClick={onNavigateHome}
            className="text-xs text-cocoa hover:text-ink underline"
          >
            ← মূল দোকানে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Admin Header */}
      <div className="bg-white rounded-2xl border border-champagne p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gold/20 text-ink rounded-full flex items-center justify-center font-bold">
            <Shield className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-ink">
              {STORE_CONFIG.name} — এডমিন ড্যাশবোর্ড
            </h1>
            <p className="text-xs text-cocoa">
              ইনভেন্টরি, অর্ডার ও স্টোর সেটিংস পর্যবেক্ষণ
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateHome}
            className="bg-sand hover:bg-champagne text-ink px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            দোকান দেখুন (Live Store)
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            title="লগআউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-champagne/60 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders' ? 'bg-ink text-cream' : 'text-cocoa hover:bg-champagne/40'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-gold" />
          <span>অর্ডারসমূহ ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'products' ? 'bg-ink text-cream' : 'text-cocoa hover:bg-champagne/40'
          }`}
        >
          <Package className="w-4 h-4 text-gold" />
          <span>শাড়ি ইনভেন্টরি ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'settings' ? 'bg-ink text-cream' : 'text-cocoa hover:bg-champagne/40'
          }`}
        >
          <Settings className="w-4 h-4 text-gold" />
          <span>কনফিগ সেটিংস</span>
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-ink">গ্রাহকদের অর্ডারের তালিকা</h3>
            <button
              onClick={loadOrders}
              className="text-xs text-cocoa hover:text-ink underline"
            >
              রিফ্রেশ
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-champagne text-cocoa text-sm">
              এখনও কোনো নতুন অর্ডার জমা পড়েনি। কাস্টমার স্টোর থেকে অর্ডার প্লেস করলে এখানে তালিকা দেখা যাবে।
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl border border-champagne p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-champagne/60 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-ink bg-sand px-2.5 py-1 rounded-lg">
                        #{ord.id}
                      </span>
                      <span className="text-xs text-cocoa">
                        {new Date(ord.date).toLocaleString('bn-BD')}
                      </span>
                    </div>

                    {/* Status dropdown */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-cocoa font-semibold">স্ট্যাটাস:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : ord.status === 'Confirmed'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-sand text-ink border-champagne'
                        }`}
                      >
                        <option value="Pending">Pending (অপেক্ষমান)</option>
                        <option value="Confirmed">Confirmed (নিশ্চিত)</option>
                        <option value="Shipped">Shipped (কুরিয়ারে প্রেরিত)</option>
                        <option value="Delivered">Delivered (বিতরিত)</option>
                        <option value="Cancelled">Cancelled (বাতিল)</option>
                      </select>

                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                        title="অর্ডার মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Customer and Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-sand/30 p-3 rounded-xl border border-champagne/40">
                      <p className="font-bold text-ink">গ্রাহক তথ্য:</p>
                      <p>নাম: <strong className="text-ink">{ord.customer.name}</strong></p>
                      <p>ফোন: <a href={`tel:${ord.customer.phone}`} className="text-blue-600 underline">{ord.customer.phone}</a></p>
                      <p>ঠিকানা: {ord.customer.address}</p>
                      <p>এলাকা: {ord.deliveryZone} (চার্জ ৳{ord.deliveryFee})</p>
                      {ord.customer.notes && <p className="italic text-cocoa/80">নোট: {ord.customer.notes}</p>}
                    </div>

                    <div className="space-y-1 bg-sand/30 p-3 rounded-xl border border-champagne/40">
                      <p className="font-bold text-ink">অর্ডারকৃত পণ্যসমূহ:</p>
                      <div className="divide-y divide-champagne/40">
                        {ord.items.map((it, i) => (
                          <div key={i} className="py-1 flex justify-between">
                            <span>{it.name} x {it.quantity}</span>
                            <span className="font-bold">৳{it.total.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-champagne flex justify-between font-bold text-ink text-sm">
                        <span>সর্বমোট প্রদেয়:</span>
                        <span className="text-gold">৳{ord.grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-ink">শাড়ি ইনভেন্টরি ম্যানেজমেন্ট</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gold hover:bg-gold/90 text-ink px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন শাড়ি যোগ করুন</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-champagne overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-cocoa">
                <thead className="bg-sand/60 text-ink font-bold border-b border-champagne">
                  <tr>
                    <th className="p-3">ছবি ও নাম</th>
                    <th className="p-3">ক্যাটাগরি / ফেব্রিক</th>
                    <th className="p-3">মূল্য</th>
                    <th className="p-3">স্টক স্ট্যাটাস</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-champagne/60">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-sand/20">
                      <td className="p-3 flex items-center space-x-3">
                        <img src={prod.image} alt={prod.name} className="w-10 h-12 object-cover rounded-lg border border-champagne" />
                        <div>
                          <div className="font-bold text-ink">{prod.name}</div>
                          <div className="text-[10px] text-cocoa/60 font-mono">ID: {prod.id}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>{prod.fabric}</div>
                        <span className="text-[10px] bg-champagne/60 px-2 py-0.5 rounded-full">{prod.category}</span>
                      </td>
                      <td className="p-3 font-bold text-ink">
                        ৳{prod.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleStock(prod.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prod.inStock ? 'ইন-স্টক (Active)' : 'স্টক শেষ (Out)'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONFIG SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-champagne p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">কনফিগারেশন ও সেটিংস (src/config.js)</h3>
            <p className="text-xs text-cocoa">
              এই মানগুলো <code className="bg-sand px-1 py-0.5 rounded font-mono">src/config.js</code> ফাইল থেকে নিয়ন্ত্রিত হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-sand/30 p-4 rounded-xl border border-champagne space-y-2">
              <h4 className="font-bold text-ink">স্টোর তথ্য</h4>
              <p>দোকানের নাম: <strong className="text-ink">{STORE_CONFIG.name}</strong> ({STORE_CONFIG.banglaName})</p>
              <p>ট্যাগলাইন: {STORE_CONFIG.tagline}</p>
              <p>মোবাইল / WhatsApp: <strong className="text-ink font-mono">{STORE_CONFIG.phone}</strong></p>
              <p>বিকাশ ও নগদ (bKash & Nagad): <strong className="text-gold font-mono">{STORE_CONFIG.bkashNumber}</strong></p>
              <p>অবস্থান / শো-রুম: {STORE_CONFIG.showroom}</p>
              <p>ইমেইল: {STORE_CONFIG.email}</p>
            </div>

            <div className="bg-sand/30 p-4 rounded-xl border border-champagne space-y-2">
              <h4 className="font-bold text-ink">ডেলিভারি ও কুপন</h4>
              <p>ঢাকার ভিতরে ডেলিভারি চার্জ: ৳{STORE_CONFIG.delivery.insideDhaka}</p>
              <p>ঢাকার বাইরে ডেলিভারি চার্জ: ৳{STORE_CONFIG.delivery.outsideDhaka}</p>
              <p>ফ্রি ডেলিভারি নূন্যতম অর্ডার: ৳{STORE_CONFIG.delivery.freeDeliveryThreshold}</p>
              <div className="pt-2">
                <span className="font-bold block mb-1">সক্রিয় কুপনসমূহ:</span>
                {STORE_CONFIG.coupons.map((c) => (
                  <div key={c.code} className="font-mono text-[11px] bg-white p-1 rounded border border-champagne mb-1">
                    {c.code} — {c.description} (ন্যূনতম ৳{c.minOrder})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <div className="bg-cream rounded-3xl border border-champagne p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-lg font-display font-bold text-ink mb-4 border-b border-champagne pb-2">
              নতুন শাড়ি যোগ করুন
            </h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">শাড়ির নাম (বাংলা ও ইংরেজি)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রাজকীয় মিরপুর কাতান শাড়ি"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-champagne bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ক্যাটাগরি</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-champagne bg-white font-medium"
                  >
                    <option value="banarasi">বেনারসি ও কাতান</option>
                    <option value="jamdani">ঢাকাই জামদানি</option>
                    <option value="silk">রাজশাহী সিল্ক</option>
                    <option value="cotton">টাঙ্গাইল তাঁত সুতি</option>
                    <option value="party">পার্টি শাড়ি</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">মূল্য (৳ BDT)</label>
                  <input
                    type="number"
                    required
                    placeholder="উদা: 5500"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-champagne bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ফেব্রিক / উপাদান</label>
                  <input
                    type="text"
                    placeholder="উদা: পিউর রেশমি কাতান সিল্ক"
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-champagne bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">রঙ</label>
                  <input
                    type="text"
                    placeholder="উদা: মেরুন ও সোনালী জরি"
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-champagne bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ছবির URL (Image link)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-champagne bg-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">বিবরণ (Description)</label>
                <textarea
                  rows={2}
                  placeholder="শাড়ির বিশেষ বৈশিষ্ট্য লিখুন..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-champagne bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-champagne">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-cocoa hover:bg-sand"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-ink text-cream font-bold hover:bg-ink/90"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPanel;
