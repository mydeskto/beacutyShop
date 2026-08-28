import React from 'react';
import { Leaf, FlaskConical, HeartHandshake, Droplets, Sparkles, Award, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  onNavigateToShop: () => void;
}

export const AboutPage: React.FC<Props> = ({ onNavigateToShop }) => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-20 sm:py-28 bg-[#EAEFEA] border-b border-[#D5DFD7] overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="text-xs uppercase font-bold tracking-[0.24em] text-[#3A6048] block">
            Our Living Manifesto
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1C3829] leading-tight">
            Harmonizing Botanical Purity with Dermatological Precision
          </h1>
          <p className="text-base sm:text-lg text-[#4A5D50] max-w-2xl mx-auto font-normal leading-relaxed">
            Born from a desire to strip away toxic fillers and synthetic fragrances, Purelis crafts high-performance skincare and mindful kitchen heirlooms built to last generations.
          </p>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-[#EAE5DA] shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C3829]">100% Certified Clean</h3>
            <p className="text-xs sm:text-sm text-[#5E6E64] leading-relaxed">
              Every drop is rigorously free from parabens, sulfates, silicones, microplastics, and synthetic colorants. We formulate only with biocompatible actives.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#EAE5DA] shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C3829]">Clinically Proven Actives</h3>
            <p className="text-xs sm:text-sm text-[#5E6E64] leading-relaxed">
              We marry cold-pressed botanical extracts with high-efficacy clinical molecules: 3-O-Ethyl Ascorbic Acid, Multi-Molecular Hyaluronic Acid, and 5-Ceramide complexes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#EAE5DA] shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C3829]">Sustainable Living</h3>
            <p className="text-xs sm:text-sm text-[#5E6E64] leading-relaxed">
              From infinitely recyclable flint glass bottles to lead-free enameled cast iron kitchenware and organic Belgian flax linens, we steward the Earth at every step.
            </p>
          </div>

        </div>
      </section>

      {/* Story Narrative */}
      <section className="py-16 bg-white border-y border-[#ECE7DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8DA792]">
                Our Roots
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C3829] leading-snug">
                From the apothecary counter to your morning mirror
              </h2>
              <p className="text-sm text-[#4A5D50] leading-relaxed">
                Founded in 2021 by clean cosmetic chemists and holistic culinary advocates, Purelis was born out of frustration with skincare products loaded with synthetic texturizers that clog skin barriers, and flimsy cookware that leaches chemicals into food.
              </p>
              <p className="text-sm text-[#4A5D50] leading-relaxed">
                We believe your wellness is a holistic ritual — from the serum you gently pat onto your cheekbones at dawn, to the nourishing vegetable stew simmered slowly in a handcrafted ceramic Dutch oven at dusk.
              </p>

              <div className="pt-4">
                <button
                  onClick={onNavigateToShop}
                  className="px-8 py-3.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-[0.14em] rounded-lg transition-colors shadow flex items-center gap-2"
                >
                  <span>EXPLORE OUR CURATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#EAE5DA]">
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80"
                  alt="Purelis Botanical Laboratory"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
