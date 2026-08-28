import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Check, X, 
  ExternalLink, Sparkles, Filter, Package, AlertCircle 
} from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface Props {
  categories: Category[];
  onProductClick: (slug: string) => void;
}

export const AdminProducts: React.FC<Props> = ({ categories, onProductClick }) => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');

  // Add/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    department: 'beauty' as 'beauty' | 'home-kitchen' | 'both',
    categoryId: categories[0]?.id || 'cleansers',
    categoryName: categories[0]?.name || 'Cleansers',
    subcategoryId: '',
    subcategoryName: '',
    brand: 'PURELIS Botanical',
    sku: '',
    price: 34,
    salePrice: 28,
    costPrice: 8,
    stockQuantity: 50,
    shortDescription: '',
    description: '',
    ingredientsStr: '',
    benefitsStr: '',
    imagesStr: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    volumeOrWeight: '150ml / 5.1 fl. oz.',
    bestseller: false,
    newArrival: true,
    isOrganic: true,
    isCrueltyFree: true
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      department: 'beauty',
      categoryId: categories[0]?.id || 'cleansers',
      categoryName: categories[0]?.name || 'Cleansers',
      subcategoryId: '',
      subcategoryName: '',
      brand: 'PURELIS Botanical',
      sku: `PUR-${Math.floor(1000 + Math.random() * 9000)}`,
      price: 38,
      salePrice: 32,
      costPrice: 9,
      stockQuantity: 45,
      shortDescription: 'Gentle, dermatologist-developed clean formula.',
      description: 'Handcrafted with cold-pressed botanical extracts to restore natural radiance.',
      ingredientsStr: 'Camellia Sinensis Leaf Extract, Niacinamide, Hyaluronic Acid, Aloe Barbadensis',
      benefitsStr: 'Soothes inflammation, Restores moisture barrier, Non-comedogenic',
      imagesStr: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      volumeOrWeight: '120ml / 4.0 fl. oz.',
      bestseller: false,
      newArrival: true,
      isOrganic: true,
      isCrueltyFree: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      department: p.department,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      subcategoryId: p.subcategoryId || '',
      subcategoryName: p.subcategoryName || '',
      brand: p.brand,
      sku: p.sku,
      price: p.price,
      salePrice: p.salePrice || 0,
      costPrice: p.costPrice || 0,
      stockQuantity: p.stockQuantity,
      shortDescription: p.shortDescription || '',
      description: p.description,
      ingredientsStr: p.ingredients?.join(', ') || '',
      benefitsStr: p.benefits?.join(', ') || '',
      imagesStr: p.images.join('\n'),
      volumeOrWeight: p.volumeOrWeight || '',
      bestseller: !!p.bestseller,
      newArrival: !!p.newArrival,
      isOrganic: !!p.isOrganic,
      isCrueltyFree: !!p.isCrueltyFree
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    await api.deleteProduct(id);
    showToast('Product Deleted', `${name} removed from inventory catalog.`, 'info');
    loadProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const catObj = categories.find(c => c.id === formData.categoryId);
    const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const images = formData.imagesStr.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const ingredients = formData.ingredientsStr.split(',').map(s => s.trim()).filter(Boolean);
    const benefits = formData.benefitsStr.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Partial<Product> = {
      name: formData.name,
      slug: formData.slug || generatedSlug,
      department: formData.department,
      categoryId: formData.categoryId,
      categoryName: catObj?.name || formData.categoryName,
      subcategoryId: formData.subcategoryId,
      subcategoryName: formData.subcategoryName,
      brand: formData.brand,
      sku: formData.sku,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      costPrice: Number(formData.costPrice),
      stockQuantity: Number(formData.stockQuantity),
      shortDescription: formData.shortDescription,
      description: formData.description,
      ingredients,
      benefits,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'],
      volumeOrWeight: formData.volumeOrWeight,
      bestseller: formData.bestseller,
      newArrival: formData.newArrival,
      isOrganic: formData.isOrganic,
      isCrueltyFree: formData.isCrueltyFree
    };

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, payload);
      showToast('Product Updated', `Changes to "${formData.name}" have been published.`, 'success');
    } else {
      await api.createProduct(payload as any);
      showToast('Product Created', `"${formData.name}" added to store catalog!`, 'success');
    }

    setModalOpen(false);
    loadProducts();
  };

  const filteredProducts = products.filter((p) => {
    if (selectedDept !== 'all' && p.department !== selectedDept) return false;
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">Catalog & Inventory</h2>
          <p className="text-xs text-[#5E6E64]">Manage skincare formulas, cookware variants, and stock balances.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-[#EAE5DA] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-[#8DA792] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or ingredient..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
          >
            <option value="all">All Departments</option>
            <option value="beauty">Beauty & Skincare</option>
            <option value="home-kitchen">Home & Kitchen</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE7DE] text-[#7A8A7F] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category / Dept</th>
                <th className="py-3 px-4">Price / Cost</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE7DE]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7A8A7F]">
                    Loading inventory catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7A8A7F]">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span
                            onClick={() => onProductClick(p.slug)}
                            className="font-bold text-[#1C3829] hover:underline cursor-pointer block truncate max-w-xs"
                          >
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#7A8A7F] font-mono">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1C3829] block">{p.categoryName}</span>
                      <span className="text-[10px] text-[#7A8A7F] uppercase tracking-wider">
                        {p.department}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1C3829]">
                        ${(p.salePrice ?? p.price).toFixed(2)}
                      </div>
                      {p.salePrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          ${p.price.toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        p.stockQuantity > 10 ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${p.stockQuantity > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {p.stockQuantity} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.bestseller && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            BEST
                          </span>
                        )}
                        {p.newArrival && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded text-stone-600 hover:bg-stone-100 hover:text-[#1C3829]"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif font-bold text-xl text-[#1C3829]">
                {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Product to Catalog'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    <option value="beauty">Beauty & Skincare</option>
                    <option value="home-kitchen">Home & Kitchen</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Regular Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Sale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Image URLs (one per line or comma-separated)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.imagesStr}
                  onChange={(e) => setFormData({ ...formData, imagesStr: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Key Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={formData.ingredientsStr}
                  onChange={(e) => setFormData({ ...formData, ingredientsStr: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              {/* Badges checklist */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="accent-[#1C3829]"
                  />
                  <span>Bestseller</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="accent-[#1C3829]"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isOrganic}
                    onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                    className="accent-[#1C3829]"
                  />
                  <span>Certified Organic</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 text-xs border border-stone-300 rounded-lg uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase rounded-lg transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
