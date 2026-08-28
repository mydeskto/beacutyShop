import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit, Trash2, CheckCircle2, X } from 'lucide-react';
import { Banner } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminBanners: React.FC = () => {
  const { showToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('EXPLORE COLLECTION');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [placement, setPlacement] = useState<'hero' | 'promo' | 'category_top'>('hero');
  const [active, setActive] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await api.getBanners();
      setBanners(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('Pure Botanical Potency');
    setSubtitle('Cold-pressed botanical elixirs formulated with clean bioactive extracts.');
    setTagline('100% ORGANIC CERTIFIED');
    setImageUrl('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80');
    setCtaText('SHOP THE RITUAL');
    setCtaLink('/shop');
    setPlacement('hero');
    setActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setTagline(b.tagline || '');
    setImageUrl(b.imageUrl);
    setCtaText(b.ctaText);
    setCtaLink(b.ctaLink);
    setPlacement(b.placement);
    setActive(b.active);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete banner "${name}"?`)) return;
    await api.deleteBanner(id);
    showToast('Banner Deleted', `${name} removed.`, 'info');
    loadBanners();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const payload = {
      title,
      subtitle,
      tagline,
      imageUrl,
      ctaText,
      ctaLink,
      placement,
      active
    };

    if (editingBanner) {
      await api.updateBanner(editingBanner.id, payload);
      showToast('Banner Updated', `Updated ${title}.`, 'success');
    } else {
      await api.createBanner(payload as any);
      showToast('Banner Created', `Added ${title} to marketing media!`, 'success');
    }

    setModalOpen(false);
    loadBanners();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">Marketing Banners & Visual Promos</h2>
          <p className="text-xs text-[#5E6E64]">Manage high-resolution Hero imagery, promo cards, and call-to-actions.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-[#EAE5DA] overflow-hidden shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                    {b.placement}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    b.active ? 'bg-emerald-600 text-white' : 'bg-stone-500 text-white'
                  }`}>
                    {b.active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                {b.tagline && (
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8DA792] block">
                    {b.tagline}
                  </span>
                )}
                <h3 className="font-serif font-bold text-lg text-[#1C3829]">{b.title}</h3>
                <p className="text-xs text-[#5E6E64] line-clamp-2">{b.subtitle}</p>
                <div className="pt-2 text-xs font-semibold text-[#1C3829]">
                  Button: <span className="underline">{b.ctaText}</span> → <code className="text-[#7A8A7F]">{b.ctaLink}</code>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(b)}
                className="p-1.5 rounded text-stone-600 hover:bg-stone-100"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(b.id, b.title)}
                className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-[#1C3829]">
                {editingBanner ? 'Edit Banner' : 'Create Banner'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Tagline Pill</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Subtitle / Body</label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">CTA Target Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Placement</label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as any)}
                    className="text-xs p-2 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    <option value="hero">Hero Main Banner</option>
                    <option value="promo">Homepage Promo Mid-Banner</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs text-stone-700 pt-4">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#1C3829]"
                  />
                  <span>Active & Visible</span>
                </label>
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
