import React from 'react';
import { Calendar, User, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost } from '../../types';

interface Props {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

export const BlogPage: React.FC<Props> = ({ posts, onSelectPost }) => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.24em] text-[#8DA792] block">
            The Botanical Journal
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C3829] leading-tight">
            Rituals, Skincare &amp; Mindful Living
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6E64] max-w-lg mx-auto leading-relaxed">
            In-depth guides on barrier restoration, natural active ingredients, and kitchen wellness.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post.slug)}
              className="bg-white rounded-2xl border border-[#EAE5DA] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAEFEA] text-[#1C3829]">
                      {post.category}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#7A8A7F] flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      {post.readTimeMinutes} min read
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#1C3829] group-hover:text-[#2A4E3B] transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs text-[#5E6E64] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-[#7A8A7F]">
                <span className="truncate pr-2">By {post.authorName}</span>
                <span className="font-bold text-[#1C3829] group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

