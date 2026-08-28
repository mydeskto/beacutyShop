import React from 'react';
import { Category } from '../../types';

interface Props {
  categories: Category[];
  title?: string;
  subtitle?: string;
  onSelectCategory: (slug: string) => void;
}

// Fallback high-fidelity category visuals matching the screenshot exactly
const CATEGORY_VISUALS: Record<string, { name: string; image: string; fallback: string; slug: string }> = {
  'cleansers': {
    name: 'CLEANSERS',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    slug: 'cleansers'
  },
  'serums': {
    name: 'SERUMS',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1608248597359-54845520d235?auto=format&fit=crop&w=600&q=80',
    slug: 'serums'
  },
  'moisturizers': {
    name: 'MOISTURIZERS',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    slug: 'moisturizers'
  },
  'sun-care': {
    name: 'SUN CARE',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1567928815104-b7980ee5032e?auto=format&fit=crop&w=600&q=80',
    slug: 'sun-care'
  },
  'skin-care-kits': {
    name: 'SKIN CARE KITS',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    slug: 'skin-care-kits'
  },
  'best-sellers': {
    name: 'BEST SELLERS',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1608248597359-54845520d235?auto=format&fit=crop&w=600&q=80',
    slug: 'best-sellers'
  }
};

export const CategoryGrid: React.FC<Props> = ({
  categories,
  title = 'SHOP BY CATEGORY',
  subtitle,
  onSelectCategory
}) => {
  const displayItems = [
    CATEGORY_VISUALS['cleansers'],
    CATEGORY_VISUALS['serums'],
    CATEGORY_VISUALS['moisturizers'],
    CATEGORY_VISUALS['sun-care'],
    CATEGORY_VISUALS['skin-care-kits'],
    CATEGORY_VISUALS['best-sellers']
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Serif Title Matching Screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3829] tracking-[0.14em] uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-[#6E7E73] font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* 6 Category Items Row Matching Screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {displayItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectCategory(item.slug)}
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Photo Box */}
              <div className="w-full aspect-square overflow-hidden bg-[#ECE6DB]/80 border border-[#E0D8CB] relative p-2.5 transition-all duration-300 group-hover:border-[#1C3829] group-hover:shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== item.fallback) {
                      target.src = item.fallback;
                    }
                  }}
                />
              </div>

              {/* White Boxed Label Below Photo */}
              <div className="w-full mt-2.5">
                <button
                  type="button"
                  className="w-full py-2 px-2 bg-white group-hover:bg-[#1C3829] border border-[#DDD5C7] group-hover:border-[#1C3829] text-[11px] font-bold uppercase tracking-[0.14em] text-[#1C3829] group-hover:text-white transition-all duration-200 shadow-2xs text-center truncate cursor-pointer"
                >
                  {item.name}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
