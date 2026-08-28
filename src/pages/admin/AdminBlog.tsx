import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, X, Clock, Calendar } from 'lucide-react';
import { BlogPost } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminBlog: React.FC = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Skincare Science');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [tagsStr, setTagsStr] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getBlogPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle('The Art of Skin Fasting: Restoring Your Natural Lipid Barrier');
    setSlug('the-art-of-skin-fasting');
    setCategory('Skincare Science');
    setExcerpt('Why taking a break from multi-step routines and focusing on cold-pressed barrier lipids can revitalize tired skin.');
    setContent('Skin fasting is an ancient, minimalist approach to dermatology where we strip away active acids and focus solely on biocompatible squalane, green tea polyphenols, and gentle cleansing.');
    setFeaturedImage('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80');
    setReadTimeMinutes(4);
    setTagsStr('Skin Barrier, Clean Beauty, Minimalism');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: BlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setFeaturedImage(p.featuredImage);
    setReadTimeMinutes(p.readTimeMinutes);
    setTagsStr(p.tags.join(', '));
    setModalOpen(true);
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!window.confirm(`Delete article "${postTitle}"?`)) return;
    await api.deleteBlogPost(id);
    showToast('Article Deleted', `${postTitle} removed.`, 'info');
    loadPosts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tags = tagsStr.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      title,
      slug: generatedSlug,
      category,
      excerpt,
      content,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      authorName: 'Dr. Elena Vance, Senior Cosmetic Chemist',
      readTimeMinutes: Number(readTimeMinutes),
      tags,
      published: true
    };

    if (editingPost) {
      await api.updateBlogPost(editingPost.id, payload);
      showToast('Article Updated', `Published edits for ${title}.`, 'success');
    } else {
      await api.createBlogPost(payload as any);
      showToast('Article Published', `Published new article ${title}!`, 'success');
    }

    setModalOpen(false);
    loadPosts();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">The Botanical Journal (Articles CMS)</h2>
          <p className="text-xs text-[#5E6E64]">Publish educational skincare rituals, kitchen guides, and clean beauty articles.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Blog list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-[#EAE5DA] overflow-hidden shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="h-40 bg-stone-100 overflow-hidden">
                <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#7A8A7F]">
                  <span className="font-bold uppercase tracking-wider text-[#1C3829] bg-[#EAEFEA] px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                  <span>{p.readTimeMinutes} min read</span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#1C3829] line-clamp-2">{p.title}</h3>
                <p className="text-xs text-[#5E6E64] line-clamp-2">{p.excerpt}</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[#7A8A7F]">{new Date(p.publishedAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 rounded text-stone-600 hover:bg-stone-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-[#1C3829]">
                {editingPost ? 'Edit Journal Article' : 'Write Journal Article'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Read Time (minutes)</label>
                  <input
                    type="number"
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Featured Image URL</label>
                <input
                  type="text"
                  required
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Full Article Content (Markdown / Paragraphs)</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Skincare, Kitchen, Clean Beauty"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs border rounded uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1C3829] text-white text-xs font-bold uppercase rounded"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
