import { loadData, saveData } from '../db.js';

export const productController = {
  getAllProducts: (req: any, res: any) => {
    const data = loadData();
    res.json({ success: true, products: data.products || [] });
  },

  getProductBySlugOrId: (req: any, res: any) => {
    const { idOrSlug } = req.params;
    const data = loadData();
    const product = (data.products || []).find((p: any) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  },

  createOrUpdateProduct: (req: any, res: any) => {
    const productData = req.body;
    const data = loadData();
    const products = data.products || [];

    if (productData.id) {
      const idx = products.findIndex((p: any) => p.id === productData.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...productData, updatedAt: new Date().toISOString() };
        saveData(data);
        return res.json({ success: true, product: products[idx] });
      }
    }

    const newProduct = {
      ...productData,
      id: `prod_${Date.now()}`,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    saveData(data);
    res.json({ success: true, product: newProduct });
  },

  deleteProduct: (req: any, res: any) => {
    const { id } = req.params;
    const data = loadData();
    data.products = (data.products || []).filter((p: any) => p.id !== id);
    saveData(data);
    res.json({ success: true, deletedId: id });
  },

  getCategories: (req: any, res: any) => {
    const data = loadData();
    res.json({ success: true, categories: data.categories || [] });
  },

  getCollections: (req: any, res: any) => {
    const data = loadData();
    res.json({ success: true, collections: data.collections || [] });
  }
};
