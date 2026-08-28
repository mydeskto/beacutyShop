import React from 'react';
import { Leaf, RefreshCw, Package } from 'lucide-react';
import { Banner } from '../../types';

interface Props {
  banner?: Banner;
  onExplore: () => void;
}

export const PromoBanner: React.FC<Props> = ({ banner, onExplore }) => {
  const buttonText = banner?.buttonText || 'EXPLORE OFFERS';

  return (
    <section className="py-6 sm:py-10 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#E8EDE6] border border-[#D5DDD3] overflow-hidden p-5 sm:p-10 lg:p-14 relative shadow-2xs">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Content Matching Screenshot */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-[11px] sm:text-[13px] uppercase font-bold tracking-[0.16em] text-[#334D3D]">
                  GOOD FOR YOUR SKIN.
                </div>
                <div className="text-[11px] sm:text-[13px] uppercase font-bold tracking-[0.16em] text-[#334D3D]">
                  GOOD FOR THE PLANET.
                </div>
              </div>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C3829] leading-tight">
                Up to 25% Off Sitewide
              </h3>

              <div className="pt-1 sm:pt-2">
                <button
                  onClick={onExplore}
                  className="w-full sm:w-auto bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.16em] px-8 py-3 sm:py-3.5 rounded-none transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-center"
                >
                  {buttonText}
                </button>
              </div>

              {/* Bottom 3 values matching screenshot */}
              <div className="pt-4 sm:pt-5 border-t border-[#D5DFD7]/80 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-[#2A4333] font-medium">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2A4333] stroke-[1.75]" />
                  <span>Clean Beauty</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2A4333] stroke-[1.75]" />
                  <span>Sustainable</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2A4333] stroke-[1.75]" />
                  <span>Eco-Friendly Packaging</span>
                </div>
              </div>
            </div>

            {/* Right Promotional Image Display */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <div className="rounded-xl overflow-hidden shadow-md border border-white/60 bg-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"
                    alt="Purelis Promo Collection"
                    className="w-full h-[220px] sm:h-[340px] lg:h-[360px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
