import React from 'react';
import { 
  Category, Collection, Banner, HomepageSection, 
  Product, StoreSettings 
} from '../../types';
import { HeroBanner } from '../../components/storefront/HeroBanner';
import { TrustBadges } from '../../components/storefront/TrustBadges';
import { CategoryGrid } from '../../components/storefront/CategoryGrid';
import { PromoBanner } from '../../components/storefront/PromoBanner';
import { ProductCard } from '../../components/storefront/ProductCard';
import { NewsletterSection } from '../../components/storefront/NewsletterSection';
import { ArrowRight, Sparkles, Star, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  homepageSections?: HomepageSection[];
  sections?: HomepageSection[];
  categories?: Category[];
  collections?: Collection[];
  banners?: Banner[];
  products?: Product[];
  settings?: StoreSettings;
  posts?: any[];
  onNavigate?: (path: string) => void;
  onNavigateToShop?: () => void;
  onNavigateToCategory?: (idOrSlug: string) => void;
  onNavigateToProduct?: (slug: string) => void;
  onNavigateToPost?: (slug: string) => void;
}

export const HomePage: React.FC<Props> = ({
  homepageSections: propSections,
  sections: aliasSections,
  categories = [],
  collections = [],
  banners = [],
  products = [],
  settings,
  posts = [],
  onNavigate: propOnNavigate,
  onNavigateToShop,
  onNavigateToCategory,
  onNavigateToProduct,
  onNavigateToPost
}) => {
  const navigateHandler = (path: string) => {
    if (propOnNavigate) {
      propOnNavigate(path);
    } else {
      window.location.hash = `#${path}`;
    }
  };

  const sectionsToRender = (propSections && propSections.length > 0)
    ? propSections
    : (aliasSections && aliasSections.length > 0)
    ? aliasSections
    : [
        { id: 'sec_1', type: 'hero' as const, title: 'Hero Banner', active: true, order: 1 },
        { id: 'sec_2', type: 'trust_badges' as const, title: 'Trust Badges', active: true, order: 2 },
        { id: 'sec_3', type: 'categories' as const, title: 'SHOP BY CATEGORY', subtitle: '', active: true, order: 3 },
        { id: 'sec_4', type: 'promo_banner' as const, title: 'Seasonal Promo', active: true, order: 4 },
        { id: 'sec_5', type: 'new_arrivals' as const, title: 'NEW ARRIVALS', subtitle: '', active: true, order: 5 },
      ];

  const heroBanner = banners.find(b => b.type === 'hero') || banners[0];
  const promoBanner = banners.find(b => b.type === 'promotional') || banners[1] || banners[0];

  // Specific 4 showcase products matching the reference picture
  const signatureProducts = [
    products.find(p => p.slug === 'calming-green-tea-face-wash' || p.name.includes('Green Tea')),
    products.find(p => p.slug === 'vitamin-c-brightening-serum' || p.name.includes('Vitamin C')),
    products.find(p => p.slug === 'hydra-barrier-peptide-moisturizer' || p.name.includes('Hydra Barrier') || p.name.includes('Moisturizer')),
    products.find(p => p.slug === 'tinted-peptide-lip-balm-petal-rose' || p.name.includes('Lip Balm'))
  ].filter(Boolean) as Product[];

  const newArrivals = signatureProducts.length === 4 
    ? signatureProducts 
    : (products.filter(p => p.newArrival).slice(0, 4).length === 4 
        ? products.filter(p => p.newArrival).slice(0, 4) 
        : products.slice(0, 4));
  const bestsellers = products.filter(p => p.bestseller).slice(0, 4);
  const kitchenProducts = products.filter(p => p.department === 'home-kitchen').slice(0, 4);

  // Render dynamic homepage sections in the order specified in Admin Homepage Builder
  return (
    <div className="min-h-screen">
      {sectionsToRender.map((section) => {
        if (!section.active) return null;

        switch (section.type) {
          case 'hero':
            return (
              <HeroBanner
                key={section.id}
                banner={heroBanner}
                onCtaClick={() => (onNavigateToShop ? onNavigateToShop() : navigateHandler(heroBanner?.buttonUrl || '/shop'))}
              />
            );

          case 'trust_badges':
            return <TrustBadges key={section.id} />;

          case 'categories':
            return (
              <CategoryGrid
                key={section.id}
                title={section.title || 'SHOP BY CATEGORY'}
                subtitle={section.subtitle}
                categories={categories.slice(0, (section as any).data?.limit || 6)}
                onSelectCategory={(slug) => (onNavigateToCategory ? onNavigateToCategory(slug) : navigateHandler(`/category/${slug}`))}
              />
            );

          case 'promo_banner':
            return (
              <PromoBanner
                key={section.id}
                banner={promoBanner}
                onExplore={() => (onNavigateToShop ? onNavigateToShop() : navigateHandler(promoBanner?.buttonUrl || '/shop?sale=true'))}
              />
            );

          case 'new_arrivals':
            return (
              <section key={section.id} className="py-14 sm:py-18 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Section Header Matching Reference Image */}
                  <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-10 pb-3 border-b border-[#ECE7DE]">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3829] tracking-wider uppercase">
                        {section.title || 'NEW ARRIVALS'}
                      </h2>
                      {section.subtitle && (
                        <p className="text-xs sm:text-sm text-[#5E6E64] mt-1 font-normal">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => (onNavigateToShop ? onNavigateToShop() : navigateHandler('/shop?sort=newest'))}
                      className="text-xs font-bold uppercase tracking-[0.14em] text-[#1C3829] hover:text-[#2E553F] transition-colors mt-2 sm:mt-0 flex items-center gap-1 group cursor-pointer"
                    >
                      <span>VIEW ALL</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Product Cards Row (4 cards matching reference image) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {newArrivals.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onProductClick={(slug) => (onNavigateToProduct ? onNavigateToProduct(slug) : navigateHandler(`/product/${slug}`))}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'bestsellers':
            return (
              <section key={section.id} className="py-14 sm:py-18 bg-white border-y border-[#ECE7DE]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-10 pb-3 border-b border-[#ECE7DE]">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3829] tracking-wider uppercase">
                        {section.title || 'CUSTOMER FAVORITES'}
                      </h2>
                      {section.subtitle && (
                        <p className="text-xs sm:text-sm text-[#5E6E64] mt-1 font-normal">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => (onNavigateToShop ? onNavigateToShop() : navigateHandler('/shop?sort=bestselling'))}
                      className="text-xs font-bold uppercase tracking-[0.14em] text-[#1C3829] hover:text-[#2E553F] transition-colors mt-2 sm:mt-0 flex items-center gap-1 group cursor-pointer"
                    >
                      <span>VIEW ALL</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {bestsellers.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onProductClick={(slug) => (onNavigateToProduct ? onNavigateToProduct(slug) : navigateHandler(`/product/${slug}`))}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'kitchen_spotlight':
            return (
              <section key={section.id} className="py-14 sm:py-18 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="rounded-2xl bg-[#F5EFE6] border border-[#E2D6C5] p-6 sm:p-10 lg:p-12 mb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-6 space-y-4">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C6C38]">
                          Mindful Living & Kitchen
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1C3829]">
                          Artisan Kitchen Essentials & Living Textiles
                        </h2>
                        <p className="text-xs sm:text-sm text-[#4F5E54] leading-relaxed">
                          Handcrafted enamelled cast iron Dutch ovens, solid Acacia end-grain cutting blocks, and pure European organic flax linens made to enrich your daily home rituals.
                        </p>
                        <div className="pt-2">
                          <button
                            onClick={() => (onNavigateToCategory ? onNavigateToCategory('kitchen-dining') : navigateHandler('/shop?department=home-kitchen'))}
                            className="bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-[0.14em] px-6 py-3 rounded-md transition-colors shadow flex items-center gap-2 cursor-pointer"
                          >
                            <span>EXPLORE HOME & KITCHEN</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-6">
                        <div className="grid grid-cols-2 gap-3">
                          {kitchenProducts.slice(0, 2).map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => (onNavigateToProduct ? onNavigateToProduct(prod.slug) : navigateHandler(`/product/${prod.slug}`))}
                              className="bg-white rounded-xl p-3 border border-[#E0D9CC] hover:shadow-md transition-shadow cursor-pointer group"
                            >
                              <div className="aspect-square rounded-lg overflow-hidden bg-[#FAF8F5] mb-2 p-1">
                                <img
                                  src={prod.images[0]}
                                  alt={prod.name}
                                  className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <h4 className="text-xs font-bold text-[#1C3829] truncate">{prod.name}</h4>
                              <span className="text-xs font-semibold text-[#8C6C38] mt-1 block">
                                ₹{Number.isInteger(prod.salePrice ?? prod.price) ? (prod.salePrice ?? prod.price) : (prod.salePrice ?? prod.price).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'testimonials':
            return (
              <section key={section.id} className="py-14 sm:py-18 bg-[#EAEFEA] border-t border-[#D5DFD7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A6048]">
                      Verified Customer Love
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3829] uppercase mt-1">
                      {section.title || 'WHAT OUR COMMUNITY SAYS'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {((section as any).data?.items || [
                      { quote: 'The botanical hydration serum transformed my sensitive skin barrier in just 10 days.', author: 'Sophia V.', location: 'San Francisco, CA', product: 'Ceramide Serum' },
                      { quote: 'Unbeatable enameled cast iron quality. Cooks beautifully and looks gorgeous in our open kitchen.', author: 'Marcus L.', location: 'Austin, TX', product: 'Enameled Dutch Oven' },
                      { quote: 'Finally clean beauty that is genuinely effective, non-comedogenic, and responsibly packaged.', author: 'Elena R.', location: 'Seattle, WA', product: 'Antioxidant Oil' }
                    ]).map((test: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white/90 border border-[#D5DFD7] shadow-2xs flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-[#222E26] italic leading-relaxed">
                            "{test.quote}"
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-[#1C3829]">{test.author}</h4>
                            <span className="text-[11px] text-[#7A8A7F]">{test.location}</span>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAEFEA] text-[#1C3829]">
                            {test.product}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'newsletter':
            return (
              <NewsletterSection
                key={section.id}
                settings={settings || ({} as any)}
                onNavigateToAbout={() => navigateHandler('/about')}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
