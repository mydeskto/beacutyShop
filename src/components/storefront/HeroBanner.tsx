import React from 'react';
import { Banner } from '../../types';
import { Sparkles, ShieldCheck, Award, Star } from 'lucide-react';
import heroImageDefault from '../../assets/images/purelis_hero_banner_1787584890049.jpg';

interface Props {
  banner?: Banner;
  onCtaClick: () => void;
}

export const HeroBanner: React.FC<Props> = ({ banner, onCtaClick }) => {
  const displayImage = banner?.desktopImage || heroImageDefault;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F6F3] via-[#EAEFEA] to-[#F7F5F0] border-b border-[#D8E2D8]">
      {/* Botanical ambient glow circles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#D1E2D4]/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] py-12 sm:py-16 lg:py-20">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6 text-left max-w-2xl">
            
            {/* Top Pill badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/80 shadow-2xs animate-fadeIn">
              <Sparkles className="w-3 h-3 text-emerald-700 animate-pulse" />
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#1C3829]">
                100% Organic &amp; Dermatologist Tested
              </span>
            </div>

            {/* Bold Headline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-[56px] font-serif font-bold text-[#1C3829] tracking-tight leading-[1.12]">
                Pure Botanical Luxury for Radiant Skin.
              </h1>
            </div>

            {/* Subheading / Description */}
            <p className="text-xs sm:text-base text-[#3E5244] leading-relaxed font-normal max-w-lg">
              Formulated with cold-pressed antioxidants, bioactive green tea extracts, and barrier-repairing peptides for timeless, glowing vitality.
            </p>

            {/* CTA & Rating Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={onCtaClick}
                className="w-full sm:w-auto bg-[#1C3829] hover:bg-[#285038] active:bg-[#122418] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.18em] px-8 sm:px-10 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-center"
              >
                EXPLORE COLLECTION
              </button>

              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#E0D9CC]">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#1C3829]">4.9 / 5.0</span>
                  <span className="text-[#6E7E73] ml-1">(12,450+ Reviews)</span>
                </div>
              </div>
            </div>

            {/* Micro trust highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#DCE6DE]/60 max-w-lg">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3E5244]">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Cruelty-Free &amp; Vegan</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3E5244]">
                <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Clean Beauty Award 2026</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3E5244]">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Carbon-Neutral Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Product Composition Visual */}
          <div className="lg:col-span-5 flex justify-center items-center relative mt-4 lg:mt-0">
            <div className="relative w-full max-w-[480px] flex items-center justify-center p-4">
              {/* Soft backdrop glow */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-xl" />
              
              <img
                src={displayImage}
                alt="PURELIS Clean Skincare Trio on Stone Podium"
                className="relative z-10 w-full h-auto max-h-[420px] sm:max-h-[480px] object-contain drop-shadow-xl rounded-2xl transform hover:scale-[1.02] transition-transform duration-500"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


