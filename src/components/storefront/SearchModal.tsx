import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (slug: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const SearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSearchSubmit
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    'Green Tea Cleanser',
    'Vitamin C Serum',
    'Ceramide Moisturizer',
    'Mineral Sunscreen SPF 50',
    'Dutch Oven',
    'Acacia Cutting Board',
    'Amber Apothecary'
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const found = await api.getProducts({ search: query });
        setResults(found.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fadeIn">
      <div 
        className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#EAE5DA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-[#EAE5DA] p-4 sm:p-6">
          <Search className="w-6 h-6 text-[#8DA792] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cleansers, serums, cookware, ingredients..."
            className="w-full bg-transparent border-none text-base sm:text-lg text-[#1C3829] placeholder:text-[#8A9B8F] px-4 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#8A9B8F] hover:text-[#1C3829] mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-xs font-semibold text-[#1C3829]"
          >
            ESC
          </button>
        </form>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            /* Popular Searches */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7A8A7F]">
                <TrendingUp className="w-4 h-4 text-[#8DA792]" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E0D9CC] text-xs font-medium text-[#222E26] hover:border-[#1C3829] hover:bg-[#FAF8F5] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-sm text-[#7A8A7F]">
              Searching pure formulas & essentials...
            </div>
          ) : results.length > 0 ? (
            /* Search Results */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#7A8A7F]">
                <span>Matching Products ({results.length})</span>
                <button
                  type="button"
                  onClick={() => {
                    onSearchSubmit(query);
                    onClose();
                  }}
                  className="text-[#1C3829] hover:underline flex items-center gap-1"
                >
                  <span>View all results</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => {
                  const price = product.salePrice ?? product.price;
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product.slug);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#EAE5DA] hover:border-[#1C3829] hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 p-1">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#1C3829] group-hover:text-[#2E553F] truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-[#1C3829]">
                            ${price.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-[#7A8A7F] uppercase tracking-wider">
                            {product.categoryName}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-semibold text-[#1C3829]">No products found for "{query}"</p>
              <p className="text-xs text-[#7A8A7F]">Try searching for green tea, vitamin c, ceramic, or toner.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
