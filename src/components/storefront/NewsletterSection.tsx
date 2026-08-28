import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../../types';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

interface Props {
  settings: StoreSettings;
  onNavigateToAbout: () => void;
}

export const NewsletterSection: React.FC<Props> = ({ settings, onNavigateToAbout }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the Purelis Family! 🌿', 'Your 15% VIP welcome code: PURE20 has been sent to your email.', 'success');
    try {
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } });
    } catch {
      // Fallback
    }
  };

  return (
    <section className="bg-[#FAF8F5] border-t border-[#ECE7DE] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3 Trust Columns (Matching Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#ECE7DE]">
          
          {/* Free Shipping */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center shrink-0 border border-[#D5DFD7]">
              <Truck className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C3829]">
                FREE SHIPPING
              </h4>
              <p className="text-xs text-[#5E6E64] mt-0.5">
                On all domestic orders over ${settings.freeShippingThreshold || 50}
              </p>
            </div>
          </div>

          {/* Easy Returns */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center shrink-0 border border-[#D5DFD7]">
              <RotateCcw className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C3829]">
                EASY RETURNS
              </h4>
              <p className="text-xs text-[#5E6E64] mt-0.5">
                30-day gentle satisfaction guarantee
              </p>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center shrink-0 border border-[#D5DFD7]">
              <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C3829]">
                SECURE PAYMENT
              </h4>
              <p className="text-xs text-[#5E6E64] mt-0.5">
                100% verified Stripe 256-bit encrypted checkout
              </p>
            </div>
          </div>

        </div>

        {/* Newsletter & Brand Philosophy Row (Matching Reference Image) */}
        <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Newsletter Box */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-serif font-bold text-lg sm:text-xl uppercase tracking-wider text-[#1C3829]">
              SUBSCRIBE TO OUR NEWSLETTER
            </h3>
            <p className="text-xs sm:text-sm text-[#5E6E64]">
              Get exclusive offers, clean beauty rituals & new product launches delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#EAEFEA] border border-[#D5DFD7] text-xs font-semibold text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you for subscribing! Check your email for your welcome gift.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-white border border-[#DDD5C7] rounded-md text-xs text-[#1C3829] placeholder:text-[#8A9B8F] focus:outline-hidden focus:border-[#1C3829]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] text-white text-xs font-bold uppercase tracking-[0.14em] rounded-md transition-colors shadow-2xs cursor-pointer"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>

          {/* About Brand Box (Matching Reference Image) */}
          <div className="lg:col-span-6 space-y-3 lg:pl-6 border-t lg:border-t-0 lg:border-l border-[#ECE7DE] pt-6 lg:pt-0">
            <h3 className="font-serif font-bold text-lg sm:text-xl uppercase tracking-wider text-[#1C3829]">
              ABOUT PURELIS
            </h3>
            <p className="text-xs sm:text-sm text-[#5E6E64] leading-relaxed">
              At Purelis, we believe in the power of nature and dermatological science working in harmony to bring out your natural glow. Pure, effective, and derived with conscious care for you and our planet.
            </p>
            <div>
              <button
                onClick={onNavigateToAbout}
                className="text-xs font-bold uppercase tracking-wider text-[#1C3829] hover:text-[#2A4E3B] underline underline-offset-4 cursor-pointer"
              >
                LEARN MORE →
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
