import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section aria-label="Trust and purity standards" className="bg-white border-b border-[#E8ECE8] py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
          
          {/* Badge 1: Natural Ingredients */}
          <div className="flex items-center gap-3 justify-start sm:justify-center">
            <div className="text-[#1C3829] shrink-0">
              <svg className="w-6 h-6 stroke-[#1C3829]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2-1.3 7.7-6 8.8-9 8.8z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-[#1C3829] tracking-tight leading-snug font-sans">
                Natural Ingredients
              </h4>
              <p className="text-[11px] text-[#55695C] font-normal leading-tight mt-0.5">
                Safe &amp; toxin-free
              </p>
            </div>
          </div>

          {/* Badge 2: Clinically Tested */}
          <div className="flex items-center gap-3 justify-start sm:justify-center">
            <div className="text-[#1C3829] shrink-0">
              <svg className="w-6 h-6 stroke-[#1C3829]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.07-10.127A2 2 0 0 1 14 9.527V2" />
                <path d="M8.5 2h7" />
                <path d="M7 16h10" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-[#1C3829] tracking-tight leading-snug font-sans">
                Clinically Tested
              </h4>
              <p className="text-[11px] text-[#55695C] font-normal leading-tight mt-0.5">
                Dermatologically proven
              </p>
            </div>
          </div>

          {/* Badge 3: Cruelty Free (Bunny/Rabbit Icon) */}
          <div className="flex items-center gap-3 justify-start sm:justify-center">
            <div className="text-[#1C3829] shrink-0">
              <svg className="w-6 h-6 stroke-[#1C3829]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.5 18.5c-1.5 1.5-4 2-7 2-4.5 0-7-2.5-7-6 0-3 2.5-5 5.5-5.5.5-1.5 1.5-3.5 3-5.5 1.2-1.6 2.5-2 3-1.5.7.7.3 2.5-.5 4.5 1.5-1.5 3-2 3.8-1.5.8.6.5 2.5-.8 4.5 2 .5 3.5 1.8 3.5 4 0 2.5-1.5 4.5-3.5 5z" />
                <circle cx="15.5" cy="13.5" r="0.8" fill="#1C3829" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-[#1C3829] tracking-tight leading-snug font-sans">
                Cruelty Free
              </h4>
              <p className="text-[11px] text-[#55695C] font-normal leading-tight mt-0.5">
                We never test on animals
              </p>
            </div>
          </div>

          {/* Badge 4: For All Skin Types */}
          <div className="flex items-center gap-3 justify-start sm:justify-center">
            <div className="text-[#1C3829] shrink-0">
              <svg className="w-6 h-6 stroke-[#1C3829]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-[#1C3829] tracking-tight leading-snug font-sans">
                For All Skin Types
              </h4>
              <p className="text-[11px] text-[#55695C] font-normal leading-tight mt-0.5">
                Gentle &amp; effective care
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


