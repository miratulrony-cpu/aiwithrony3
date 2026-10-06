import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Award, ArrowRight } from 'lucide-react';
import STORE_CONFIG from '../config';

export function HeroBanner({ onExploreCategory }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-champagne/40 via-cream to-cream border-b border-champagne/60">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-champagne/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-champagne/70 border border-gold/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cocoa animate-fadeUp">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>{STORE_CONFIG.tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink leading-[1.15]">
              ঐতিহ্যের রূপকথা, <br />
              <span className="text-gold italic font-normal">আভিজাত্যের</span> নিখুঁত ছোঁয়া
            </h1>

            <p className="text-base sm:text-lg text-cocoa max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              বাঙালি নারীর শাশ্বত সৌন্দর্য ফুটিয়ে তুলতে আমাদের সংগ্রহে রয়েছে খাঁটি ঢাকাই জামদানি, রয়্যাল বেনারসি, রাজশাহী পিউর সিল্ক ও টাঙ্গাইল তাঁতের প্রিমিয়াম শাড়ি।
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onExploreCategory('banarasi')}
                className="bg-gold hover:bg-gold/90 text-ink font-semibold px-6 py-3 rounded-full shadow-soft transition-all duration-200 flex items-center space-x-2 active:scale-95"
              >
                <span>বেনারসি কালেকশন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onExploreCategory('jamdani')}
                className="bg-cream hover:bg-champagne/50 border border-cocoa/30 text-ink font-medium px-6 py-3 rounded-full transition-all duration-200 active:scale-95"
              >
                <span>ঢাকাই জামদানি</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-champagne/70 text-left">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">১০০% অরিজিনাল</h4>
                  <p className="text-[11px] text-cocoa hidden sm:block">খাঁটি তাঁত ও সুতা</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">দ্রুত হোম ডেলিভারি</h4>
                  <p className="text-[11px] text-cocoa hidden sm:block">সারা বাংলাদেশে</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">ক্যাশ অন ডেলিভারি</h4>
                  <p className="text-[11px] text-cocoa hidden sm:block">দেখে মূল্য পরিশোধ</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/30 via-champagne to-transparent rounded-3xl transform rotate-3 scale-95 transition-transform duration-500 hover:rotate-6"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-ink rounded-3xl overflow-hidden shadow-2xl border-4 border-champagne/80">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  alt="RN Fashion BD House Saree Showcase"
                  className="w-full h-80 sm:h-96 object-cover object-center transition-transform duration-700 hover:scale-105"
                />

                {/* Floating highlight badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-ink/80 backdrop-blur-md border border-gold/40 rounded-2xl p-4 text-cream shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold">ব্রাইডাল স্পেশাল ২০২৬</span>
                      <h4 className="text-sm font-bold text-cream">মিরপুর রয়্যাল কাতান বেনারসি</h4>
                    </div>
                    <span className="text-sm font-bold text-champagne bg-gold/20 px-2.5 py-1 rounded-full border border-gold/30">
                      {STORE_CONFIG.currencySymbol}৮,৫০০
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
