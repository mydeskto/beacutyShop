import React, { useState } from 'react';
import { Plus, Edit, Trash2, Grid, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface Props {
  categories: Category[];
  onReloadCategories: () => void;
}

export const AdminCategories: React.FC<Props> = ({ categories, onReloadCategories }) => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [department, setDepartment] = useState<'beauty' | 'home-kitchen'>('beauty');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDepartment('beauty');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80');
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDepartment(c.department);
    setDescription(c.description || '');
    setImage(c.image || '');
    setModalOpen(true);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    await api.deleteCategory(id);
    showToast('Category Deleted', `${catName} removed.`, 'info');
    onReloadCategories();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      name,
      slug: generatedSlug,
      department,
      description,
      image,
      subcategories: editingCategory?.subcategories || []
    };

    if (editingCategory) {
      await api.updateCategory(editingCategory.id, payload);
      showToast('Category Updated', `Updated ${name}.`, 'success');
    } else {
      await api.createCategory(payload as any);
      showToast('Category Created', `Added ${name} to store!`, 'success');
    }

    setModalOpen(false);
    onReloadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">Departments & Categories</h2>
          <p className="text-xs text-[#5E6E64]">Organize beauty rituals and kitchen product taxonomies.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-[#EAE5DA] p-5 shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAEFEA] text-[#1C3829]">
                    {cat.department}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#1C3829] mt-1">{cat.name}</h3>
                  <span className="text-[10px] text-[#7A8A7F] font-mono">slug: /{cat.slug}</span>
                </div>
              </div>

              <p className="text-xs text-[#5E6E64] mt-3 line-clamp-2">{cat.description}</p>

              {cat.subcategories.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Subcategories:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.subcategories.map(sub => (
                      <span key={sub.id} className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 rounded text-stone-600 hover:bg-stone-100 hover:text-[#1C3829]"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-[#1C3829]">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cleansers & Balms"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cleansers"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    <option value="beauty">Beauty & Skincare</option>
                    <option value="home-kitchen">Home & Kitchen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Category Image URL</label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
