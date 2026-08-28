import React from 'react';
import { Clock, User, Calendar, ArrowLeft, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { BlogPost } from '../../types';

interface Props {
  post: BlogPost;
  onBackToBlog: () => void;
  onNavigateToShop: () => void;
}

export const BlogPostPage: React.FC<Props> = ({ post, onBackToBlog, onNavigateToShop }) => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C3829] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <article className="bg-white rounded-2xl border border-[#EAE5DA] p-6 sm:p-12 shadow-2xs space-y-8">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EAEFEA] text-[#1C3829]">
                {post.category}
              </span>
              <span className="text-xs text-[#7A8A7F] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTimeMinutes} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C3829] leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between py-4 border-y border-[#ECE7DE] text-xs text-[#5E6E64]">
              <div>
                Written by <strong className="text-[#1C3829]">{post.authorName}</strong> on {new Date(post.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                {post.tags.map((t, i) => (
                  <span key={i} className="text-[11px] text-[#7A8A7F] bg-[#FAF8F5] px-2 py-0.5 rounded border border-stone-200">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden aspect-16/9 bg-[#FAF8F5]">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Body Content */}
          <div className="prose max-w-none text-[#222E26] text-sm sm:text-base leading-relaxed space-y-6">
            <p className="text-lg font-serif italic text-[#1C3829]">
              {post.excerpt}
            </p>

            <div className="whitespace-pre-line leading-relaxed space-y-4">
              {post.content}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-8 border-t border-[#ECE7DE] bg-[#EAEFEA] -mx-6 sm:-mx-12 -mb-6 sm:-mb-12 p-8 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1C3829]">Explore Purelis Clean Formulations</h3>
              <p className="text-xs text-[#5E6E64]">Dermatologist developed, toxin-free, and packaged in recyclable flint glass.</p>
            </div>
            <button
              onClick={onNavigateToShop}
              className="px-6 py-3 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow"
            >
              Shop Featured Formulations
            </button>
          </div>

        </article>

      </div>
    </div>
  );
};
