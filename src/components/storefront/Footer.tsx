import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Facebook, Instagram, Youtube } from 'lucide-react';
import { StoreSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

interface Props {
  settings: StoreSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigate }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email', 'Enter your email address to join our botanical newsletter.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to PURELIS!', 'You are now subscribed to exclusive offers and beauty rituals.', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full">
      {/* Light Upper Section Matching Screenshot */}
      <div className="bg-[#FAF8F5] border-t border-[#ECE5D8] py-12 sm:py-16 text-[#222E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 items-start">
            
            {/* Column 1: 3 Trust Benefit Items */}
            <div className="space-y-6">
              <div className="flex items-start gap-3.5">
                <Truck className="w-5 h-5 text-[#1C3829] stroke-[1.75] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C3829]">
                    FREE SHIPPING
                  </h4>
                  <p className="text-xs text-[#6B7B71] mt-0.5 font-normal">
                    On orders over {settings.currencySymbol || '₹'}499
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <RotateCcw className="w-5 h-5 text-[#1C3829] stroke-[1.75] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C3829]">
                    EASY RETURNS
                  </h4>
                  <p className="text-xs text-[#6B7B71] mt-0.5 font-normal">
                    14 days return policy
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-[#1C3829] stroke-[1.75] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C3829]">
                    SECURE PAYMENT
                  </h4>
                  <p className="text-xs text-[#6B7B71] mt-0.5 font-normal">
                    100% secure checkout
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Newsletter & Social Icons */}
            <div className="space-y-4 text-center md:text-left">
              <div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#1C3829]">
                  SUBSCRIBE TO OUR NEWSLETTER
                </h4>
                <p className="text-xs text-[#6B7B71] mt-1 font-normal">
                  Get exclusive offers, beauty tips & new product updates.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex items-center max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-3.5 py-2.5 bg-white border border-[#D5DDD3] rounded-l-none text-xs text-[#1C3829] placeholder-[#8C9C91] focus:outline-none focus:border-[#1C3829]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer shrink-0"
                >
                  {subscribed ? 'JOINED' : 'SUBSCRIBE'}
                </button>
              </form>

              {/* Social Icons */}
              <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href={settings.facebookUrl || "https://facebook.com"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-7 h-7 rounded-full border border-[#D0D9D2] hover:border-[#1C3829] hover:bg-[#1C3829] hover:text-white text-[#4A5D52] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href={settings.instagramUrl || "https://instagram.com"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-7 h-7 rounded-full border border-[#D0D9D2] hover:border-[#1C3829] hover:bg-[#1C3829] hover:text-white text-[#4A5D52] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href={settings.youtubeUrl || "https://youtube.com"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-7 h-7 rounded-full border border-[#D0D9D2] hover:border-[#1C3829] hover:bg-[#1C3829] hover:text-white text-[#4A5D52] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                  className="w-7 h-7 rounded-full border border-[#D0D9D2] hover:border-[#1C3829] hover:bg-[#1C3829] hover:text-white text-[#4A5D52] flex items-center justify-center transition-colors cursor-pointer font-bold text-[11px]"
                >
                  P
                </a>
              </div>
            </div>

            {/* Column 3: About Purelis */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#1C3829]">
                ABOUT PURELIS
              </h4>
              <p className="text-xs text-[#5E6E64] leading-relaxed font-normal">
                At Purelis, we believe in the power of nature and science working together to bring out your natural glow. Pure, effective and derived with care for you and the planet.
              </p>
              <button
                onClick={() => onNavigate('/about')}
                className="text-xs font-bold uppercase tracking-wider text-[#1C3829] hover:text-[#2A4E3B] underline underline-offset-4 transition-colors cursor-pointer block pt-1"
              >
                LEARN MORE
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Dark Forest Green Bottom Copyright Bar Matching Screenshot */}
      <div className="bg-[#132B1E] text-[#D0E2D6] py-3.5 px-4 sm:px-6 lg:px-8 border-t border-[#1C3829]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            © 2025 Purelis Skincare. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-[#A6C4B0]">
            <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span className="text-[#2B4B37]">|</span>
            <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <span className="text-[#2B4B37]">|</span>
            <button onClick={() => onNavigate('/shipping-policy')} className="hover:text-white transition-colors cursor-pointer">
              Shipping Policy
            </button>
            <span className="text-[#2B4B37]">|</span>
            <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors cursor-pointer">
              Contact Us
            </button>
            <span className="text-[#2B4B37]">|</span>
            <button onClick={() => onNavigate('/admin/dashboard')} className="text-emerald-400 hover:text-white transition-colors cursor-pointer font-medium">
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
