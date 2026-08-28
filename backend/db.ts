import fs from 'fs';
import path from 'path';

// Persistent memory store backed by JSON or initial defaults
const DATA_FILE = path.join(process.cwd(), 'backend', 'dataStore.json');

const defaultData = {
  users: [
    {
      id: 'usr_admin',
      firstName: 'Eleanor',
      lastName: 'Vance',
      email: 'admin@purelis.com',
      password: 'Admin@Purelis2026!',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      addresses: [],
      savedCards: []
    }
  ],
  products: [
    {
      id: 'prod_1',
      name: 'Botanical Clarifying Green Tea Cleanser',
      slug: 'botanical-clarifying-green-tea-cleanser',
      sku: 'PUR-CLN-01',
      description: 'A gentle, sulfate-free daily cleanser infused with organic green tea, chamomile, and aloe vera. Effectively removes impurities while preserving natural skin barrier lipids.',
      shortDescription: 'Gentle clarifying botanical wash with organic green tea & chamomile.',
      price: 36.00,
      salePrice: 32.00,
      stockQuantity: 145,
      categoryId: 'cat_cleansers',
      categoryName: 'Cleansers',
      brand: 'PURELIS Botanicals',
      department: 'beauty',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608248597359-f5383a152342?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'active',
      featured: true,
      bestseller: true,
      isOrganic: true,
      isCrueltyFree: true,
      isVegan: true,
      rating: 4.9,
      reviewCount: 420,
      volumeOrWeight: '150ml / 5.1 fl. oz',
      ingredients: ['Camellia Sinensis (Organic Green Tea)', 'Aloe Barbadensis Leaf Juice', 'Glycerin', 'Chamomilla Recutita Extract', 'Coco-Glucoside'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_2',
      name: 'Vitamin C Glow & Barrier Serum',
      slug: 'vitamin-c-glow-and-barrier-serum',
      sku: 'PUR-SRM-02',
      description: 'High-potency 15% Vitamin C complex combined with hyaluronic acid and niacinamide. Instantly brightens dull complexion and supports collagen synthesis.',
      shortDescription: '15% Vitamin C complex for radiant vitality and antioxidant defense.',
      price: 58.00,
      salePrice: 49.00,
      stockQuantity: 92,
      categoryId: 'cat_serums',
      categoryName: 'Serums & Actives',
      brand: 'PURELIS Botanicals',
      department: 'beauty',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'active',
      featured: true,
      bestseller: true,
      isOrganic: true,
      isCrueltyFree: true,
      isVegan: true,
      rating: 4.95,
      reviewCount: 680,
      volumeOrWeight: '30ml / 1.0 fl. oz',
      ingredients: ['Sodium Ascorbyl Phosphate (Vitamin C)', 'Hyaluronic Acid', 'Niacinamide (Vitamin B3)', 'Terminalia Ferdinandiana (Kakadu Plum)', 'Jojoba Esters'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_3',
      name: 'Deep Peptide Moisture Cream',
      slug: 'deep-peptide-moisture-cream',
      sku: 'PUR-CRM-03',
      description: 'Rich, velvet-texture restorative moisturizer packed with multi-peptides, ceramides, and cold-pressed squalane. Locks in 72-hour hydration.',
      shortDescription: 'Restorative barrier cream with ceramides & peptides.',
      price: 64.00,
      stockQuantity: 64,
      categoryId: 'cat_moisturizers',
      categoryName: 'Moisturizers',
      brand: 'PURELIS Botanicals',
      department: 'beauty',
      images: [
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'active',
      featured: true,
      bestseller: false,
      isOrganic: true,
      isCrueltyFree: true,
      isVegan: true,
      rating: 4.88,
      reviewCount: 310,
      volumeOrWeight: '50ml / 1.7 fl. oz',
      ingredients: ['Squalane', 'Palmitoyl Tripeptide-1', 'Ceramide NP', 'Butyrospermum Parkii (Shea Butter)', 'Centella Asiatica'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  categories: [
    {
      id: 'cat_cleansers',
      name: 'Cleansers',
      slug: 'cleansers',
      description: 'Gentle clarifying botanical washes',
      department: 'beauty',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
      subcategories: []
    },
    {
      id: 'cat_serums',
      name: 'Serums & Actives',
      slug: 'serums',
      description: 'High potency vitamin C & glow elixirs',
      department: 'beauty',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      subcategories: []
    },
    {
      id: 'cat_moisturizers',
      name: 'Moisturizers',
      slug: 'moisturizers',
      description: 'Deep hydration & barrier repair',
      department: 'beauty',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
      subcategories: []
    }
  ],
  collections: [
    {
      id: 'col_summer',
      title: 'Summer Glow Essentials',
      slug: 'summer-glow-essentials',
      subtitle: 'Sun-drenched botanical hydration & mineral protection',
      description: 'Hand-selected daily rituals to keep your skin luminous and shielded throughout warm sunny days.',
      bannerImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
      productIds: ['prod_1', 'prod_2'],
      featured: true
    }
  ],
  orders: [],
  wishlists: {},
  auditLogs: [],
  settings: {
    storeName: 'PURELIS Skincare & Home',
    currency: 'USD',
    taxRate: 0.08,
    freeShippingThreshold: 50
  }
};

export const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading data store, using defaults:', err);
  }
  return defaultData;
};

export const saveData = (data: any) => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data store:', err);
  }
};
