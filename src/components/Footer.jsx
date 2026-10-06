import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import STORE_CONFIG from '../config';

export function Footer({ onSelectCategory, onNavigate }) {
  return (
    <footer className="bg-ink text-cream border-t border-champagne/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-champagne/20">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold to-champagne p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-ink rounded-full flex items-center justify-center text-gold font-display font-bold">
                  RN
                </div>
              </div>
              <span className="font-display font-bold text-xl text-cream tracking-tight">
                {STORE_CONFIG.name}
              </span>
            </div>
            <p className="text-xs text-champagne/70 leading-relaxed">
              {STORE_CONFIG.subTagline}। ঢাকাই জামদানি, কাতান, বেনারসি ও পিউর সিল্কের নির্ভরযোগ্য বুটিক হাউস।
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন</span>
              </a>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-gold tracking-wider uppercase">
              শাড়ির কালেকশন
            </h4>
            <ul className="space-y-2 text-xs text-champagne/80">
              <li>
                <button onClick={() => onSelectCategory('banarasi')} className="hover:text-gold transition-colors">
                  মিরপুর কাতান ও বেনারসি শাড়ি
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('jamdani')} className="hover:text-gold transition-colors">
                  ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('silk')} className="hover:text-gold transition-colors">
                  খাঁটি রাজশাহী সিল্ক ও মসলিন
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('cotton')} className="hover:text-gold transition-colors">
                  টাঙ্গাইল হ্যান্ডলুম তাঁত সুতি
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('party')} className="hover:text-gold transition-colors">
                  ডিজাইনার সেমি-জর্জেট পার্টি শাড়ি
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Showroom */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-gold tracking-wider uppercase">
              যোগাযোগ ও শো-রুম
            </h4>
            <ul className="space-y-2.5 text-xs text-champagne/80">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.showroom}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`tel:${STORE_CONFIG.phone}`} className="hover:text-gold">{STORE_CONFIG.phone}</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{STORE_CONFIG.email}</span>
              </li>
            </ul>
          </div>

          {/* Customer Trust & Payments */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-gold tracking-wider uppercase">
              পেমেন্ট ও পলিসি
            </h4>
            <div className="space-y-2 text-xs text-champagne/70">
              <p className="flex items-center gap-1.5 text-cream font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ক্যাশ অন ডেলিভারি সুবিধা</span>
              </p>
              <p>পণ্য চেক করে মূল্য পরিশোধ করার সুবিধা রয়েছে। ডেলিভারির সময় কোনো ত্রুটি থাকলে তাত্ক্ষণিক পরিবর্তন করা হয়।</p>
              
              <div className="pt-2">
                <span className="block text-[11px] text-champagne/50 mb-1.5 uppercase tracking-wider font-semibold">
                  গৃহীত পেমেন্ট মেথড:
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="bg-sand/10 px-2.5 py-1 rounded border border-champagne/20 font-bold text-champagne">ক্যাশ অন ডেলিভারি</span>
                  <span className="bg-sand/10 px-2.5 py-1 rounded border border-champagne/20 font-bold text-pink-400">bKash: {STORE_CONFIG.bkashNumber}</span>
                  <span className="bg-sand/10 px-2.5 py-1 rounded border border-champagne/20 font-bold text-orange-400">Nagad: {STORE_CONFIG.nagadNumber}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-champagne/60 gap-4">
          <p>© 2026 {STORE_CONFIG.name}. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('#/admin')}
              className="hover:text-gold transition-colors underline underline-offset-2"
            >
              এডমিন লগইন (Admin Access)
            </button>
            <span>•</span>
            <span className="text-champagne/50">{STORE_CONFIG.tagline}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
