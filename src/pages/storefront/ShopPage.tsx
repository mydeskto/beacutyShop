import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, SlidersHorizontal, ArrowUpDown, X, 
  Search, Check, Star, RefreshCw, ChevronRight, Sparkles, Layers 
} from 'lucide-react';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/storefront/ProductCard';
import { api } from '../../services/api';

interface Props {
  products?: Product[];
  categories?: Category[];
  initialCategorySlug?: string;
  initialDepartment?: string;
  initialSearch?: string;
  initialSaleOnly?: boolean;
  onNavigateToProduct: (slug: string) => void;
  onNavigateToCategory?: (slug: string) => void;
}

export const ShopPage: React.FC<Props> = ({
  products: initialProducts,
  categories: initialCategories,
  initialCategorySlug,
  initialDepartment,
  initialSearch = '',
  initialSaleOnly = false,
  onNavigateToProduct,
  onNavigateToCategory
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);

  // Fetch initial fallback data if not provided
  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      api.getProducts().then(res => setProducts(res));
    } else {
      setProducts(initialProducts);
    }
    if (!initialCategories || initialCategories.length === 0) {
      api.getCategories().then(res => setCategories(res));
    } else {
      setCategories(initialCategories);
    }
  }, [initialProducts, initialCategories]);

  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [saleOnly, setSaleOnly] = useState<boolean>(initialSaleOnly);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Synchronize state when URL or route props change
  useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategory(initialCategorySlug);
      setSelectedSubcategory('all');
    } else if (!initialCategorySlug && initialDepartment) {
      setSelectedCategory('all');
      setSelectedSubcategory('all');
    }
    if (initialDepartment) {
      setSelectedDepartment(initialDepartment);
    }
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
    if (initialSaleOnly !== undefined) {
      setSaleOnly(initialSaleOnly);
    }
  }, [initialCategorySlug, initialDepartment, initialSearch, initialSaleOnly]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  const filteredCategories = useMemo(() => {
    const cats = categories || [];
    if (selectedDepartment === 'beauty') {
      return cats.filter(c => c.department === 'beauty');
    }
    if (selectedDepartment === 'home-kitchen') {
      return cats.filter(c => c.department === 'home-kitchen');
    }
    return cats;
  }, [categories, selectedDepartment]);

  // Find active category object if viewing a specific category
  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return (categories || []).find(c => 
      c.slug.toLowerCase() === selectedCategory.toLowerCase() || 
      c.id.toLowerCase() === selectedCategory.toLowerCase() ||
      c.name.toLowerCase() === selectedCategory.toLowerCase()
    ) || null;
  }, [categories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) => {
      // Department filter
      if (selectedDepartment !== 'all' && p.department !== selectedDepartment && p.department !== 'both') {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = activeCategoryObj || (categories || []).find(c => 
          c.slug.toLowerCase() === selectedCategory.toLowerCase() || 
          c.id.toLowerCase() === selectedCategory.toLowerCase() ||
          c.name.toLowerCase() === selectedCategory.toLowerCase()
        );

        if (cat) {
          const matchCatId = cat.id.toLowerCase();
          const matchCatSlug = cat.slug.toLowerCase();
          const matchCatName = cat.name.toLowerCase();

          const prodCatId = (p.categoryId || '').toLowerCase();
          const prodCatName = (p.categoryName || '').toLowerCase();
          const prodSlug = (p.slug || '').toLowerCase();

          const isCatMatch = 
            prodCatId === matchCatId ||
            prodCatId === matchCatSlug ||
            prodCatName === matchCatName ||
            prodCatName.includes(matchCatName) ||
            prodSlug.includes(matchCatSlug);

          if (!isCatMatch) return false;
        } else {
          // Fallback if category object not found
          const qCat = selectedCategory.toLowerCase();
          const isMatch = 
            (p.categoryId || '').toLowerCase() === qCat ||
            (p.categoryName || '').toLowerCase().includes(qCat) ||
            (p.slug || '').toLowerCase().includes(qCat);
          if (!isMatch) return false;
        }
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all') {
        const qSub = selectedSubcategory.toLowerCase();
        const pSubId = (p.subcategoryId || '').toLowerCase();
        const pSubName = (p.subcategoryName || '').toLowerCase();
        if (pSubId !== qSub && !pSubName.includes(qSub) && !p.slug.toLowerCase().includes(qSub)) {
          return false;
        }
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.ingredients?.some(i => i.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Price limit
      const price = p.salePrice ?? p.price;
      if (price > maxPrice) return false;

      // Rating filter
      if (minRating > 0 && p.rating < minRating) return false;

      // Stock quantity filter
      if (inStockOnly && p.stockQuantity <= 0) return false;

      // On sale filter
      if (saleOnly && !p.salePrice) return false;

      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'bestselling') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || b.reviewCount - a.reviewCount;
      // Newest default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    products, selectedDepartment, selectedCategory, selectedSubcategory, 
    searchQuery, maxPrice, minRating, inStockOnly, saleOnly, selectedBrand, sortBy, categories, activeCategoryObj
  ]);

  const resetFilters = () => {
    setSelectedDepartment('all');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setMaxPrice(200);
    setMinRating(0);
    setInStockOnly(false);
    setSaleOnly(false);
    setSelectedBrand('all');
    if (onNavigateToCategory) {
      onNavigateToCategory('');
    }
  };

  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setSelectedSubcategory('all');
    if (onNavigateToCategory) {
      onNavigateToCategory(catSlug);
    } else {
      window.location.hash = catSlug === 'all' ? '#/shop' : `#/category/${catSlug}`;
    }
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedSubcategory !== 'all' || 
    selectedDepartment !== 'all' || searchQuery !== '' || maxPrice < 200 || 
    minRating > 0 || inStockOnly || saleOnly || selectedBrand !== 'all';

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      
      {/* 1. Category Hero Banner Section (Rendered when category is active) */}
      {activeCategoryObj ? (
        <section className="relative bg-[#1C3829] text-white py-12 sm:py-16 overflow-hidden border-b border-[#2A4E3B]">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-25">
            <img 
              src={activeCategoryObj.bannerImage || activeCategoryObj.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80'} 
              alt={activeCategoryObj.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C3829] via-[#1C3829]/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-[#8DA792] mb-4">
              <button 
                onClick={() => { window.location.hash = '#/'; }} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3 h-3" />
              <button 
                onClick={() => handleSelectCategory('all')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Shop Catalog
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium">{activeCategoryObj.name}</span>
            </nav>

            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-bold uppercase tracking-widest text-[#D5DFD7]">
                <span>{activeCategoryObj.department === 'home-kitchen' ? 'Artisan Home & Kitchen' : 'Clean Botanical Formula'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-wide">
                {activeCategoryObj.name}
              </h1>

              <p className="text-sm sm:text-base text-[#D5DFD7] leading-relaxed">
                {activeCategoryObj.description}
              </p>
            </div>

            {/* Subcategories Filter Chips */}
            {activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/15">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8DA792] block mb-3">
                  Refine by Subcategory:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSubcategory('all')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedSubcategory === 'all'
                        ? 'bg-white text-[#1C3829] shadow-md font-bold'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    All {activeCategoryObj.name} ({products.filter(p => p.categoryId === activeCategoryObj.id || p.categoryName === activeCategoryObj.name).length})
                  </button>

                  {activeCategoryObj.subcategories.map((sub) => {
                    const subCount = products.filter(p => p.subcategoryId === sub.id || p.subcategoryName === sub.name).length;
                    const isSubSelected = selectedSubcategory === sub.slug || selectedSubcategory === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubcategory(sub.slug)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSubSelected
                            ? 'bg-white text-[#1C3829] shadow-md font-bold'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
                      >
                        <span>{sub.name}</span>
                        {subCount > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSubSelected ? 'bg-[#1C3829]/10 text-[#1C3829]' : 'bg-white/20 text-white'}`}>
                            {subCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* General Shop Catalog Header */
        <section className="bg-[#FAF8F5] border-b border-[#ECE7DE] py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8DA792] block mb-1">
                  Pure Botanicals & Mindful Living
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C3829]">
                  Complete Botanical Collection
                </h1>
                <p className="text-xs sm:text-sm text-[#5E6E64] mt-1.5 max-w-xl">
                  Explore our complete selection of clean, clinical active skincare and heirloom kitchen essentials.
                </p>
              </div>

              {/* Department Selector */}
              <div className="flex items-center gap-2 bg-[#EAE5DA]/60 p-1.5 rounded-xl border border-[#DDD5C7] self-start md:self-auto">
                <button
                  onClick={() => { setSelectedDepartment('all'); setSelectedCategory('all'); }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedDepartment === 'all' && selectedCategory === 'all' ? 'bg-[#1C3829] text-white shadow-2xs' : 'text-[#47584E] hover:text-[#1C3829]'
                  }`}
                >
                  All Items ({products.length})
                </button>
                <button
                  onClick={() => { setSelectedDepartment('beauty'); setSelectedCategory('all'); }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedDepartment === 'beauty' ? 'bg-[#1C3829] text-white shadow-2xs' : 'text-[#47584E] hover:text-[#1C3829]'
                  }`}
                >
                  🌿 Beauty & Skincare
                </button>
                <button
                  onClick={() => { setSelectedDepartment('home-kitchen'); setSelectedCategory('all'); }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedDepartment === 'home-kitchen' ? 'bg-[#1C3829] text-white shadow-2xs' : 'text-[#47584E] hover:text-[#1C3829]'
                  }`}
                >
                  🍳 Home & Kitchen
                </button>
              </div>
            </div>

            {/* Category Quick Chips in Grid (No scroll) */}
            <div className="mt-8 pt-6 border-t border-[#ECE7DE] flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8A7F] mr-2">
                Browse Categories:
              </span>
              <button
                onClick={() => handleSelectCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                  selectedCategory === 'all' ? 'bg-[#1C3829] text-white' : 'bg-white border border-[#DDD5C7] text-[#222E26] hover:border-[#1C3829]'
                }`}
              >
                All
              </button>
              {filteredCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCategory(c.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                    selectedCategory === c.slug || selectedCategory === c.id ? 'bg-[#1C3829] text-white' : 'bg-white border border-[#DDD5C7] text-[#222E26] hover:border-[#1C3829]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Main Shop Catalog Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Controls Bar: Search, Mobile Filter Toggle, Sort Dropdown */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* Search within catalog */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#8DA792] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword, ingredient or formula..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#DDD5C7] rounded-lg text-xs text-[#1C3829] focus:outline-hidden focus:border-[#1C3829]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button & Sort */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#DDD5C7] rounded-lg text-xs font-semibold text-[#1C3829] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters ? '• Active' : ''}</span>
            </button>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5E6E64] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-[#DDD5C7] rounded-lg text-xs font-semibold text-[#1C3829] focus:outline-hidden focus:border-[#1C3829] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="bestselling">Best Selling</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2 pt-3 pb-4 border-b border-stone-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8A7F]">
              Active Filters:
            </span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFEA] text-[#1C3829] text-xs font-medium border border-[#D5DFD7]">
                Category: {activeCategoryObj?.name || selectedCategory}
                <button onClick={() => handleSelectCategory('all')} className="hover:text-rose-700 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFEA] text-[#1C3829] text-xs font-medium border border-[#D5DFD7]">
                Subcategory: {selectedSubcategory}
                <button onClick={() => setSelectedSubcategory('all')} className="hover:text-rose-700 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedDepartment !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFEA] text-[#1C3829] text-xs font-medium border border-[#D5DFD7]">
                Dept: {selectedDepartment === 'beauty' ? 'Beauty & Skincare' : 'Home & Kitchen'}
                <button onClick={() => setSelectedDepartment('all')} className="hover:text-rose-700 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {saleOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFEA] text-[#1C3829] text-xs font-medium border border-[#D5DFD7]">
                On Sale
                <button onClick={() => setSaleOnly(false)} className="hover:text-rose-700 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFEA] text-[#1C3829] text-xs font-medium border border-[#D5DFD7]">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="hover:text-rose-700 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFEA] text-[#1C3829] text-xs font-medium border border-[#D5DFD7]">
                Rating: {minRating}★+
                <button onClick={() => setMinRating(0)} className="hover:text-rose-700 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {maxPrice < 3000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFEA] text-[#1C3829] text-xs font-medium border border-[#D5DFD7]">
                Under ₹{maxPrice}
                <button onClick={() => setMaxPrice(3000)} className="hover:text-rose-700 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-700 hover:underline ml-2 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Catalog Grid & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            
            {/* Categories Facet */}
            <div className="bg-white rounded-xl border border-[#EAE5DA] p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECE7DE]">
                <h3 className="font-serif font-bold text-sm text-[#1C3829] uppercase tracking-wider">
                  Categories
                </h3>
                {selectedCategory !== 'all' && (
                  <button onClick={() => handleSelectCategory('all')} className="text-[11px] text-[#8DA792] hover:underline cursor-pointer">
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                <button
                  onClick={() => handleSelectCategory('all')}
                  className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all' ? 'bg-[#1C3829] text-white font-semibold' : 'text-[#47584E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>All Catalog Items</span>
                  <span className="text-[10px] opacity-70">({products.length})</span>
                </button>

                {filteredCategories.map((cat) => {
                  const catCount = products.filter(p => p.categoryId === cat.id || p.categoryName === cat.name).length;
                  const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => handleSelectCategory(cat.slug)}
                        className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-[#1C3829] text-white font-semibold' : 'text-[#47584E] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-70">({catCount})</span>
                      </button>

                      {/* Subcategories */}
                      {isSelected && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-3 space-y-1 border-l-2 border-[#1C3829]/20 ml-3 py-1">
                          {cat.subcategories.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => setSelectedSubcategory(sub.slug)}
                              className={`w-full text-left py-1 px-2 rounded text-[11px] transition-colors cursor-pointer ${
                                selectedSubcategory === sub.slug ? 'font-bold text-[#1C3829] bg-[#EAEFEA]' : 'text-[#7A8A7F] hover:text-[#1C3829]'
                              }`}
                            >
                              • {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="bg-white rounded-xl border border-[#EAE5DA] p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECE7DE]">
                <h3 className="font-serif font-bold text-sm text-[#1C3829] uppercase tracking-wider">
                  Price Limit
                </h3>
                <span className="text-xs font-bold text-[#1C3829]">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1C3829] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#7A8A7F] font-semibold">
                <span>₹100</span>
                <span>₹1,500</span>
                <span>₹3,000+</span>
              </div>
            </div>

            {/* Toggles & Brand */}
            <div className="bg-white rounded-xl border border-[#EAE5DA] p-5 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#1C3829] uppercase tracking-wider pb-2 border-b border-[#ECE7DE]">
                Preferences
              </h3>

              {/* In Stock Toggle */}
              <label className="flex items-center gap-2.5 text-xs text-[#222E26] cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#DDD5C7] text-[#1C3829] focus:ring-0 accent-[#1C3829]"
                />
                <span>In Stock Only</span>
              </label>

              {/* On Sale Toggle */}
              <label className="flex items-center gap-2.5 text-xs text-[#222E26] cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                  className="rounded border-[#DDD5C7] text-[#1C3829] focus:ring-0 accent-[#1C3829]"
                />
                <span>On Special Discount</span>
              </label>

              {/* Minimum Rating */}
              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <span className="text-xs font-bold text-[#1C3829] block">Customer Rating:</span>
                {[4.5, 4.0, 3.0].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                    className={`w-full flex items-center justify-between text-xs p-1.5 rounded transition-colors cursor-pointer ${
                      minRating === stars ? 'bg-[#EAEFEA] font-bold text-[#1C3829]' : 'text-[#47584E] hover:bg-stone-50'
                    }`}
                  >
                    <span className="flex items-center gap-1 text-amber-500">
                      {'★'.repeat(Math.floor(stars))}
                      <span className="text-[#222E26] ml-1">{stars}★ & above</span>
                    </span>
                    {minRating === stars && <Check className="w-3.5 h-3.5 text-[#1C3829]" />}
                  </button>
                ))}
              </div>

              {/* Brand Filter */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <span className="text-xs font-bold text-[#1C3829] block">Brand Collection:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-[#DDD5C7] bg-[#FAF8F5] cursor-pointer"
                >
                  <option value="all">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

            </div>

          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Products Count Info */}
            <div className="flex items-center justify-between text-xs text-[#5E6E64] pb-2 border-b border-[#ECE7DE]">
              <span>
                Showing <strong>{filteredProducts.length}</strong> clean {activeCategoryObj ? activeCategoryObj.name.toLowerCase() : 'essentials'}
              </span>
              {activeCategoryObj && (
                <button
                  onClick={() => handleSelectCategory('all')}
                  className="text-xs font-semibold text-[#1C3829] hover:underline cursor-pointer"
                >
                  View All Categories →
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EAE5DA] p-12 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1C3829]">No matching formulas found</h3>
                  <p className="text-xs text-[#6B7B71] mt-1 max-w-sm mx-auto">
                    Try adjusting your price limits, category filters, or search terms to discover items.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase rounded-md transition-colors cursor-pointer"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onNavigateToProduct}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 p-4 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-[#1C3829]">Filter Catalog</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1.5">Department</label>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'beauty', 'home-kitchen'].map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDepartment(d)}
                      className={`py-2 px-2 text-xs font-semibold rounded border uppercase cursor-pointer ${
                        selectedDepartment === d ? 'bg-[#1C3829] text-white' : 'border-stone-200'
                      }`}
                    >
                      {d === 'home-kitchen' ? 'Home' : d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1.5">Categories</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => handleSelectCategory('all')}
                    className={`py-2 px-2 text-xs font-semibold rounded border text-left truncate cursor-pointer ${
                      selectedCategory === 'all' ? 'bg-[#1C3829] text-white' : 'border-stone-200'
                    }`}
                  >
                    All Categories
                  </button>
                  {filteredCategories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCategory(c.slug)}
                      className={`py-2 px-2 text-xs font-semibold rounded border text-left truncate cursor-pointer ${
                        selectedCategory === c.slug || selectedCategory === c.id ? 'bg-[#1C3829] text-white' : 'border-stone-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1.5">Max Price (₹{maxPrice})</label>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1C3829] cursor-pointer"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#1C3829]"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saleOnly}
                    onChange={(e) => setSaleOnly(e.target.checked)}
                    className="accent-[#1C3829]"
                  />
                  <span>Sale Items</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 text-xs font-bold uppercase border border-stone-300 rounded-lg text-stone-700 cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs font-bold uppercase bg-[#1C3829] text-white rounded-lg cursor-pointer"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

