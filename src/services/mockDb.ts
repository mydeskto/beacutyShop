import { 
  Product, Category, Collection, Banner, HomepageSection, Order, 
  Coupon, ProductReview, Customer, CustomerNote, BlogPost, StoreSettings, User, InventoryLog, UserAddress, SavedPaymentCard 
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'purelis_products',
  CATEGORIES: 'purelis_categories',
  COLLECTIONS: 'purelis_collections',
  BANNERS: 'purelis_banners',
  HOMEPAGE_SECTIONS: 'purelis_homepage_sections',
  ORDERS: 'purelis_orders',
  COUPONS: 'purelis_coupons',
  REVIEWS: 'purelis_reviews',
  CUSTOMERS: 'purelis_customers',
  BLOG_POSTS: 'purelis_blog_posts',
  SETTINGS: 'purelis_settings',
  USERS: 'purelis_users',
  INVENTORY_LOGS: 'purelis_inventory_logs',
  ADDRESSES: 'purelis_addresses',
  SAVED_CARDS: 'purelis_saved_cards',
};

// Initial Seed Data
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-cleansers',
    name: 'Cleansers',
    slug: 'cleansers',
    description: 'Purifying, pH-balanced facial washes and gentle cleansing oils.',
    department: 'beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
    status: 'active',
    displayOrder: 1,
    subcategories: [
      { id: 'sub-face-wash', categoryId: 'cat-cleansers', name: 'Face Wash', slug: 'face-wash', status: 'active' },
      { id: 'sub-cleansing-oils', categoryId: 'cat-cleansers', name: 'Cleansing Oils & Balms', slug: 'cleansing-oils', status: 'active' },
      { id: 'sub-exfoliators', categoryId: 'cat-cleansers', name: 'Gentle Exfoliators', slug: 'exfoliators', status: 'active' },
    ],
  },
  {
    id: 'cat-serums',
    name: 'Serums & Actives',
    slug: 'serums',
    description: 'Targeted botanical and clinical actives for radiant, revitalized skin.',
    department: 'beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1600&q=80',
    status: 'active',
    displayOrder: 2,
    subcategories: [
      { id: 'sub-vitaminc', categoryId: 'cat-serums', name: 'Vitamin C Brightening', slug: 'vitamin-c', status: 'active' },
      { id: 'sub-hyaluronic', categoryId: 'cat-serums', name: 'Hyaluronic & Hydration', slug: 'hyaluronic', status: 'active' },
      { id: 'sub-niacinamide', categoryId: 'cat-serums', name: 'Niacinamide & BHA', slug: 'niacinamide', status: 'active' },
    ],
  },
  {
    id: 'cat-moisturizers',
    name: 'Moisturizers',
    slug: 'moisturizers',
    description: 'Barrier-repairing hydrating creams, nourishing balms, and lightweight gels.',
    department: 'beauty',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1600&q=80',
    status: 'active',
    displayOrder: 3,
    subcategories: [
      { id: 'sub-day-creams', categoryId: 'cat-moisturizers', name: 'Day Creams', slug: 'day-creams', status: 'active' },
      { id: 'sub-night-repair', categoryId: 'cat-moisturizers', name: 'Night Barrier Repair', slug: 'night-repair', status: 'active' },
      { id: 'sub-eye-creams', categoryId: 'cat-moisturizers', name: 'Eye Creams', slug: 'eye-creams', status: 'active' },
    ],
  },
  {
    id: 'cat-sun-care',
    name: 'Sun Care',
    slug: 'sun-care',
    description: 'Invisible mineral SPF 50 shields with antioxidant botanicals.',
    department: 'beauty',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1600&q=80',
    status: 'active',
    displayOrder: 4,
    subcategories: [
      { id: 'sub-spf-face', categoryId: 'cat-sun-care', name: 'Face Mineral Sunscreen', slug: 'face-spf', status: 'active' },
      { id: 'sub-spf-tinted', categoryId: 'cat-sun-care', name: 'Tinted Drops SPF', slug: 'tinted-spf', status: 'active' },
      { id: 'sub-spf-body', categoryId: 'cat-sun-care', name: 'Body Sun Protection', slug: 'body-spf', status: 'active' },
    ],
  },
  {
    id: 'cat-kits',
    name: 'Skin Care Kits',
    slug: 'skin-care-kits',
    description: 'Curated morning & evening ritual sets and discovery gift boxes.',
    department: 'beauty',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1600&q=80',
    status: 'active',
    displayOrder: 5,
    subcategories: [
      { id: 'sub-starter-kits', categoryId: 'cat-kits', name: 'Discovery Starter Kits', slug: 'starter-kits', status: 'active' },
      { id: 'sub-gift-sets', categoryId: 'cat-kits', name: 'Luxury Gift Sets', slug: 'gift-sets', status: 'active' },
    ],
  },
  {
    id: 'cat-kitchen-dining',
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    description: 'Artisan ceramic cookware, hand-carved wood boards, and chef tools.',
    department: 'home-kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    status: 'active',
    displayOrder: 6,
    subcategories: [
      { id: 'sub-cookware', categoryId: 'cat-kitchen-dining', name: 'Cookware & Dutch Ovens', slug: 'cookware', status: 'active' },
      { id: 'sub-tableware', categoryId: 'cat-kitchen-dining', name: 'Ceramics & Tableware', slug: 'tableware', status: 'active' },
      { id: 'sub-tools', categoryId: 'cat-kitchen-dining', name: 'Chefs Utensils & Boards', slug: 'kitchen-tools', status: 'active' },
    ],
  },
  {
    id: 'cat-home-decor',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Amber glass apothecary sets, stone diffusers, and organic textiles.',
    department: 'home-kitchen',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    status: 'active',
    displayOrder: 7,
    subcategories: [
      { id: 'sub-apothecary', categoryId: 'cat-home-decor', name: 'Apothecary & Storage', slug: 'apothecary-storage', status: 'active' },
      { id: 'sub-aromatherapy', categoryId: 'cat-home-decor', name: 'Diffusers & Aromatics', slug: 'diffusers', status: 'active' },
      { id: 'sub-linens', categoryId: 'cat-home-decor', name: 'Organic Linens', slug: 'linens', status: 'active' },
    ],
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Calming Green Tea Face Wash',
    slug: 'calming-green-tea-face-wash',
    sku: 'PL-SK-101',
    shortDescription: 'Gentle clarifying botanical wash with organic green tea, aloe vera and chamomile.',
    description: 'Formulated with organic Kyoto matcha, cold-pressed aloe leaf juice, and soothing chamomile extract. This non-stripping daily cleanser gently melts away daily impurities and excess sebum while preserving your delicate moisture barrier. Dermatologist-tested, pH 5.5 balanced, and formulated without sulfates, artificial fragrance, or parabens.',
    price: 499.00,
    salePrice: 499.00,
    costPrice: 120.00,
    stockQuantity: 142,
    lowStockThreshold: 15,
    categoryId: 'cat-cleansers',
    categoryName: 'Cleansers',
    subcategoryId: 'sub-face-wash',
    subcategoryName: 'Face Wash',
    brand: 'PURELIS Botanical',
    department: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-54845520d235?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.9,
    reviewCount: 128,
    volumeOrWeight: '150 ml / 5.1 fl. oz',
    ingredients: [
      'Organic Camellia Sinensis (Green Tea) Hydrosol',
      'Aloe Barbadensis Leaf Juice',
      'Cocamidopropyl Betaine',
      'Chamomilla Recutita (Matricaria) Flower Extract',
      'Glycerin',
      'Sodium Hyaluronate',
      'Panthenol (Pro-Vitamin B5)'
    ],
    benefits: [
      'Soothes redness and inflammation',
      'Maintains optimal pH 5.5 skin mantle',
      'Deeply cleanses without tight, dry sensation',
      'Clinically tested for sensitive & acne-prone skin'
    ],
    howToUse: 'Pump 1-2 doses onto damp palms. Massage gently over face and neck in circular motions for 60 seconds. Rinse thoroughly with lukewarm water.',
    variants: [
      { id: 'v-101-1', name: '150ml Standard', sku: 'PL-SK-101-STD', price: 34.00, salePrice: 28.00, stockQuantity: 100 },
      { id: 'v-101-2', name: '300ml Jumbo Refill', sku: 'PL-SK-101-JMB', price: 54.00, salePrice: 46.00, stockQuantity: 42 }
    ],
    specifications: {
      'Skin Type': 'All Skin Types, Sensitive, Combination',
      'Texture': 'Silky Gel-to-Foam',
      'Scent': 'Subtle natural Green Tea & Cucumber',
      'Certifications': 'Cruelty-Free, Vegan, Leaping Bunny Certified'
    },
    metaTitle: 'Calming Green Tea Face Wash | PURELIS Clean Skincare',
    metaDescription: 'Gentle pH-balanced green tea and aloe vera cleanser for radiant, calm skin.',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-02-15T14:30:00Z'
  },
  {
    id: 'prod-02',
    name: 'Vitamin C Brightening Serum',
    slug: 'vitamin-c-brightening-serum',
    sku: 'PL-SK-202',
    shortDescription: '15% Stabilized THD Vitamin C, 5% Niacinamide and Ferulic Acid glow serum.',
    description: 'An advanced high-potency antioxidant serum designed to visibly fade hyperpigmentation, brighten dark spots, and protect against environmental pollutants. Powered by lipid-soluble THD Ascorbate, Kakadu Plum extract, and soothing Niacinamide to deliver luminous, glass-like radiance without stinging.',
    price: 799.00,
    salePrice: 799.00,
    costPrice: 210.00,
    stockQuantity: 86,
    lowStockThreshold: 20,
    categoryId: 'cat-serums',
    categoryName: 'Serums & Actives',
    subcategoryId: 'sub-vitaminc',
    subcategoryName: 'Vitamin C Brightening',
    brand: 'PURELIS Science',
    department: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: true,
    rating: 4.95,
    reviewCount: 312,
    volumeOrWeight: '30 ml / 1.0 fl. oz',
    ingredients: [
      'Tetrahexyldecyl Ascorbate (Vitamin C 15%)',
      'Niacinamide (Vitamin B3 5%)',
      'Ferulic Acid (1%)',
      'Terminalia Ferdinandiana (Kakadu Plum) Fruit Extract',
      'Hyaluronic Acid (Triple Molecular Weight)',
      'Tocopherol (Vitamin E)',
      'Squalane'
    ],
    benefits: [
      'Visibly reduces dark spots and sun discoloration in 14 days',
      'Neutralizes free radicals and pollution damage',
      'Firms skin texture and boosts natural collagen',
      'Stabilized formula won\'t oxidize or turn orange'
    ],
    howToUse: 'Apply 3-4 drops to cleansed skin every morning before moisturizer and SPF. Gently press into face, neck, and décolleté.',
    variants: [
      { id: 'v-202-1', name: '30ml Dropper', sku: 'PL-SK-202-30', price: 799.00, salePrice: 799.00, stockQuantity: 60 },
      { id: 'v-202-2', name: '50ml Deluxe Value', sku: 'PL-SK-202-50', price: 1199.00, salePrice: 999.00, stockQuantity: 26 }
    ],
    specifications: {
      'Skin Concerns': 'Dullness, Dark Spots, Uneven Tone, Fine Lines',
      'Texture': 'Lightweight fast-absorbing silky fluid',
      'Key Active': '15% THD Ascorbate + 5% Niacinamide'
    },
    metaTitle: 'Vitamin C Brightening Serum | PURELIS Science',
    metaDescription: 'Targeted brightening serum with 15% Vitamin C and Niacinamide.',
    createdAt: '2025-01-12T11:00:00Z',
    updatedAt: '2025-02-18T10:00:00Z'
  },
  {
    id: 'prod-03',
    name: 'Hydra Barrier Moisturizer',
    slug: 'hydra-barrier-peptide-moisturizer',
    sku: 'PL-SK-303',
    shortDescription: 'Multi-ceramide and signal peptide barrier restoration cream.',
    description: 'A deeply restorative daily moisturizer enriched with 5 essential ceramides (EOP, NS, NP, AS, AP), copper tripeptides, and cold-pressed marula oil. Clinically shown to repair compromised skin barriers and deliver 72 hours of continuous hydration without clogging pores.',
    price: 649.00,
    salePrice: 649.00,
    costPrice: 160.00,
    stockQuantity: 95,
    lowStockThreshold: 15,
    categoryId: 'cat-moisturizers',
    categoryName: 'Moisturizers',
    subcategoryId: 'sub-day-creams',
    subcategoryName: 'Day Creams',
    brand: 'PURELIS Botanical',
    department: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.88,
    reviewCount: 245,
    volumeOrWeight: '50 ml / 1.7 oz jar',
    ingredients: [
      'Ceramide Complex (NP, AP, EOP, Phytosphingosine)',
      'Copper Tripeptide-1',
      'Sclerocarya Birrea (Marula) Seed Oil',
      'Centella Asiatica (Cica) Leaf Extract',
      'Sodium Hyaluronate',
      'Shea Butter Ethyl Esters'
    ],
    benefits: [
      'Strengthens weakened moisture barrier within 1 hour',
      'Locks in moisture for 72 hours',
      'Calms irritation, flaking, and retinol-induced sensitivity',
      'Non-greasy velvety matte finish under makeup'
    ],
    howToUse: 'Warm a dime-sized amount between fingertips and gently press over face, neck and décolleté day and night.',
    variants: [
      { id: 'v-303-1', name: '50ml Glass Jar', sku: 'PL-SK-303-50', price: 46.00, salePrice: 38.00, stockQuantity: 70 },
      { id: 'v-303-2', name: '50ml Eco-Refill Pod', sku: 'PL-SK-303-REF', price: 38.00, salePrice: 32.00, stockQuantity: 25 }
    ],
    specifications: {
      'Ideal For': 'Dry, Normal, Dehydrated & Sensitive Skin',
      'Finish': 'Velvety, Soft Glow',
      'Packaging': 'Recyclable frosted glass jar with bamboo lid'
    },
    metaTitle: 'Hydra Barrier Peptide Moisturizer | PURELIS Skincare',
    metaDescription: 'Ceramide and peptide repair moisturizer for radiant, hydrated skin.',
    createdAt: '2025-01-14T09:00:00Z',
    updatedAt: '2025-02-20T16:00:00Z'
  },
  {
    id: 'prod-04',
    name: 'Daily Defense Mineral Sunscreen SPF 50',
    slug: 'daily-defense-mineral-sunscreen-spf50',
    sku: 'PL-SK-404',
    shortDescription: '100% Non-nano Zinc Oxide sheer broad-spectrum mineral fluid.',
    description: 'An ultra-light, 100% mineral sunscreen that blends effortlessly into all skin tones with zero white cast or greasy residue. Fortified with ectoin, green tea polyphenols, and blue light defense shields for comprehensive daily protection.',
    price: 36.00,
    salePrice: 30.00,
    costPrice: 7.20,
    stockQuantity: 110,
    lowStockThreshold: 20,
    categoryId: 'cat-sun-care',
    categoryName: 'Sun Care',
    subcategoryId: 'sub-spf-face',
    subcategoryName: 'Face Mineral Sunscreen',
    brand: 'PURELIS Science',
    department: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.85,
    reviewCount: 94,
    volumeOrWeight: '50 ml / 1.7 fl. oz tube',
    ingredients: [
      'Zinc Oxide (18.5% Non-Nano)',
      'Ectoin (Cellular Protector)',
      'Camellia Sinensis (Green Tea) Extract',
      'Pongamia Pinnata Seed Extract',
      'Caprylic/Capric Triglyceride',
      'Polyhydroxystearic Acid'
    ],
    benefits: [
      'Broad Spectrum UVA/UVB SPF 50+ & PA++++',
      'Zero chalky white cast on deep and fair skin tones',
      'Protects against blue light and urban micro-dust',
      'Reef-safe and water-resistant for 40 minutes'
    ],
    howToUse: 'Shake well. Apply generously to face and neck 15 minutes before sun exposure. Reapply at least every 2 hours.',
    variants: [
      { id: 'v-404-1', name: '50ml Invisible Sheer', sku: 'PL-SK-404-SH', price: 36.00, salePrice: 30.00, stockQuantity: 70 },
      { id: 'v-404-2', name: '50ml Tinted Glow', sku: 'PL-SK-404-TG', price: 38.00, salePrice: 32.00, stockQuantity: 40 }
    ],
    specifications: {
      'Sun Protection': 'SPF 50+ Broad Spectrum',
      'Reef Safe': 'Yes, No Oxybenzone / Octinoxate',
      'Finish': 'Natural Satin'
    },
    metaTitle: 'Daily Defense Mineral Sunscreen SPF 50 | PURELIS',
    metaDescription: '100% Non-nano zinc oxide sunscreen with zero white cast.',
    createdAt: '2025-01-18T14:00:00Z',
    updatedAt: '2025-02-21T09:00:00Z'
  },
  {
    id: 'prod-05',
    name: 'Tinted Lip Balm SPF 20',
    slug: 'tinted-peptide-lip-balm-petal-rose',
    sku: 'PL-MU-505',
    shortDescription: 'Volumizing peptide-infused sheer tinted balm with SPF 20.',
    description: 'Nourish and enhance lips with our cushiony, peptide-packed treatment balm. Enriched with botanical oils, mango seed butter, and mineral SPF 20, it provides a gorgeous wash of healthy petal rose color while plumping fine lines.',
    price: 299.00,
    salePrice: 299.00,
    costPrice: 70.00,
    stockQuantity: 180,
    lowStockThreshold: 25,
    categoryId: 'cat-moisturizers',
    categoryName: 'Moisturizers',
    subcategoryId: 'sub-day-creams',
    subcategoryName: 'Lip Care',
    brand: 'PURELIS Botanical',
    department: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: false,
    bestseller: true,
    newArrival: true,
    rating: 4.92,
    reviewCount: 167,
    volumeOrWeight: '12 g / 0.42 oz',
    ingredients: [
      'Tripeptide-29 (Volumizing Peptide)',
      'Mangifera Indica (Mango) Seed Butter',
      'Simmondsia Chinensis (Jojoba) Seed Oil',
      'Zinc Oxide (Mineral Sunscreen)',
      'Ricinus Communis Seed Oil',
      'Natural Iron Oxides'
    ],
    benefits: [
      'Instantly hydrates and cushions dry, chapped lips',
      'Subtle buildable healthy rosy sheen',
      'Sun defense SPF 20 protects delicate lip tissue',
      'Cruelty-free & beeswax-free plant wax formula'
    ],
    howToUse: 'Glide over lips throughout the day as desired for instant hydration and color.',
    variants: [
      { id: 'v-505-1', name: 'Petal Rose', sku: 'PL-MU-505-ROSE', price: 22.00, salePrice: 18.00, stockQuantity: 80 },
      { id: 'v-505-2', name: 'Nude Almond', sku: 'PL-MU-505-ALM', price: 22.00, salePrice: 18.00, stockQuantity: 60 },
      { id: 'v-505-3', name: 'Berry Glaze', sku: 'PL-MU-505-BER', price: 22.00, salePrice: 18.00, stockQuantity: 40 }
    ],
    specifications: {
      'Finish': 'Dewy Sheer Tint',
      'Flavor': 'Natural Vanilla Pod Extract',
      'Texture': 'Cushiony Butter Balm'
    },
    metaTitle: 'Tinted Peptide Lip Balm SPF 20 | PURELIS',
    metaDescription: 'Plumping peptide lip balm with sheer tint and mineral SPF.',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-02-22T11:00:00Z'
  },
  {
    id: 'prod-06',
    name: 'Botanical Radiance Discovery Ritual Kit',
    slug: 'botanical-radiance-discovery-ritual-kit',
    sku: 'PL-KT-606',
    shortDescription: 'Complete 4-piece luxury travel collection for luminous, healthy skin.',
    description: 'Experience the signature PURELIS 4-step ritual in a bespoke travel gift box. Includes Deluxe Travel Cleanser (50ml), Brightening Vitamin C Serum (15ml), Hydra Barrier Cream (25ml), and Mineral Sunscreen SPF 50 (20ml). Beautifully packaged in an eco-friendly embossed linen keepsake box.',
    price: 78.00,
    salePrice: 64.00,
    costPrice: 18.50,
    stockQuantity: 52,
    lowStockThreshold: 10,
    categoryId: 'cat-kits',
    categoryName: 'Skin Care Kits',
    subcategoryId: 'sub-starter-kits',
    subcategoryName: 'Discovery Starter Kits',
    brand: 'PURELIS Botanical',
    department: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.96,
    reviewCount: 88,
    volumeOrWeight: '4-Piece Gift Set ($110 Value)',
    ingredients: [
      'Full Ingredient Details in Each Individual Product Packaging'
    ],
    benefits: [
      'Complete 4-step morning and evening clean routine',
      'TSA-approved luxury travel sizes',
      'Saves 35% compared to purchasing individually',
      'Presented in a premium embossed gift box'
    ],
    howToUse: 'Step 1: Cleanse with Green Tea Wash. Step 2: Brighten with Vitamin C Serum. Step 3: Hydrate with Hydra Barrier Cream. Step 4: Protect with Mineral Sunscreen SPF 50.',
    variants: [
      { id: 'v-606-1', name: 'Standard 4-Piece Set', sku: 'PL-KT-606-STD', price: 78.00, salePrice: 64.00, stockQuantity: 52 }
    ],
    specifications: {
      'Contents': 'Cleanser 50ml, Serum 15ml, Cream 25ml, SPF 20ml',
      'Box Material': '100% Recycled Cotton Paper with embossed foil'
    },
    metaTitle: 'Botanical Radiance Discovery Kit | PURELIS',
    metaDescription: 'Complete 4-step clean beauty discovery kit in a luxury gift box.',
    createdAt: '2025-01-22T08:30:00Z',
    updatedAt: '2025-02-23T15:00:00Z'
  },
  {
    id: 'prod-07',
    name: 'Cast Iron Enamelled Dutch Oven - Sage Green (5.5 Qt)',
    slug: 'cast-iron-enamelled-dutch-oven-sage',
    sku: 'PL-HK-707',
    shortDescription: 'Heavyweight artisan enamelled cast iron pot with brass knob.',
    description: 'Crafted from premium heavy-gauge cast iron with a 3-layer chip-resistant enamel coating in our signature Sage Green. Perfect for slow braising, sourdough baking, simmering stews, and elegant stovetop-to-table presentation. Oven safe up to 500°F (260°C).',
    price: 165.00,
    salePrice: 139.00,
    costPrice: 48.00,
    stockQuantity: 34,
    lowStockThreshold: 8,
    categoryId: 'cat-kitchen-dining',
    categoryName: 'Kitchen & Dining',
    subcategoryId: 'sub-cookware',
    subcategoryName: 'Cookware & Dutch Ovens',
    brand: 'PURELIS Home',
    department: 'home-kitchen',
    images: [
      'https://images.unsplash.com/photo-1584990347449-397cf1e4a3b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584990347466-9a2c286fa644?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.97,
    reviewCount: 76,
    volumeOrWeight: '5.5 Quart / 12.8 lbs',
    benefits: [
      'Exceptional heat retention and even heat distribution',
      'Non-reactive smooth interior enamel requires no seasoning',
      'Self-basting condensation dots on the underside of the lid',
      'Compatible with induction, gas, electric, ceramic & oven'
    ],
    howToUse: 'Suitable for all cooktops. Hand washing recommended with warm soapy water and non-abrasive sponge. Dry thoroughly before storing.',
    variants: [
      { id: 'v-707-1', name: '5.5 Qt Sage Green', sku: 'PL-HK-707-SAGE', price: 165.00, salePrice: 139.00, stockQuantity: 20 },
      { id: 'v-707-2', name: '5.5 Qt Cream Sand', sku: 'PL-HK-707-SAND', price: 165.00, salePrice: 139.00, stockQuantity: 14 }
    ],
    specifications: {
      'Capacity': '5.5 Quarts (Serves 4-6)',
      'Oven Safe': 'Up to 500°F (260°C)',
      'Material': 'Enameled Cast Iron & Solid Brass Knob'
    },
    metaTitle: 'Cast Iron Enamelled Dutch Oven | PURELIS Home',
    metaDescription: 'Artisan 5.5 Qt enameled cast iron dutch oven in sage green.',
    createdAt: '2025-01-25T11:00:00Z',
    updatedAt: '2025-02-19T13:00:00Z'
  },
  {
    id: 'prod-08',
    name: 'Artisan Acacia Wood End-Grain Cutting Board',
    slug: 'artisan-acacia-wood-cutting-board',
    sku: 'PL-HK-808',
    shortDescription: 'Sustainable thick end-grain cutting block with deep juice groove.',
    description: 'Handcrafted from 100% sustainably harvested solid Acacia hardwood. This end-grain cutting block protects knife edges from dulling while showcasing stunning natural wood grain patterns. Features deep perimeter juice grooves and carved recessed side handles.',
    price: 68.00,
    salePrice: 54.00,
    costPrice: 16.00,
    stockQuantity: 45,
    lowStockThreshold: 10,
    categoryId: 'cat-kitchen-dining',
    categoryName: 'Kitchen & Dining',
    subcategoryId: 'sub-tools',
    subcategoryName: 'Chefs Utensils & Boards',
    brand: 'PURELIS Home',
    department: 'home-kitchen',
    images: [
      'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: false,
    bestseller: true,
    newArrival: true,
    rating: 4.91,
    reviewCount: 52,
    volumeOrWeight: '16" x 12" x 1.5" (6.2 lbs)',
    benefits: [
      'End-grain construction self-heals and protects high-end knives',
      'Finished with food-safe organic beeswax and mineral oil',
      'Deep perimeter juice groove catches liquids seamlessly',
      'Reversible flat underside doubles as a charcuterie board'
    ],
    howToUse: 'Hand wash with mild soap and dry immediately. Treat with organic food-grade cutting board oil monthly to maintain lustrous luster.',
    variants: [
      { id: 'v-808-1', name: 'Medium (16" x 12")', sku: 'PL-HK-808-M', price: 68.00, salePrice: 54.00, stockQuantity: 30 },
      { id: 'v-808-2', name: 'Large Extra-Thick (20" x 14")', sku: 'PL-HK-808-L', price: 92.00, salePrice: 76.00, stockQuantity: 15 }
    ],
    specifications: {
      'Material': '100% Solid Acacia Hardwood',
      'Dimensions': '16 x 12 x 1.5 inches',
      'Food Safe': 'Yes, Organic beeswax finish'
    },
    metaTitle: 'Artisan Acacia Wood End-Grain Cutting Board | PURELIS Home',
    metaDescription: 'Handcrafted solid Acacia end-grain cutting block with juice groove.',
    createdAt: '2025-01-28T15:00:00Z',
    updatedAt: '2025-02-18T10:00:00Z'
  },
  {
    id: 'prod-09',
    name: 'Minimalist Amber Glass Apothecary Jars (Set of 3)',
    slug: 'amber-glass-apothecary-jars-set-of-3',
    sku: 'PL-HK-909',
    shortDescription: 'Refillable UV-blocking amber glass storage canisters with airtight lids.',
    description: 'Elevate your pantry and vanity organization with this set of 3 heavy-base amber glass canisters. Thick borosilicate glass shields coffee, loose teas, bath salts, and pantry staples from UV degradation while adding warm minimalist beauty to any shelf.',
    price: 42.00,
    salePrice: 34.00,
    costPrice: 9.00,
    stockQuantity: 68,
    lowStockThreshold: 12,
    categoryId: 'cat-home-decor',
    categoryName: 'Home & Living',
    subcategoryId: 'sub-apothecary',
    subcategoryName: 'Apothecary & Storage',
    brand: 'PURELIS Home',
    department: 'home-kitchen',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: true,
    rating: 4.88,
    reviewCount: 41,
    volumeOrWeight: 'Set of 3 (250ml, 500ml, 1000ml)',
    benefits: [
      'Protects sensitive ingredients from UV light breakdown',
      'Food-grade silicone airtight seal keeps contents crisp & fresh',
      'Dishwasher safe glass jars with natural walnut wooden lids',
      'Includes waterproof minimalist pantry label sheet'
    ],
    howToUse: 'Wipe walnut lids with dry cloth. Glass jars are 100% dishwasher safe.',
    variants: [
      { id: 'v-909-1', name: 'Walnut Wood Lids Set of 3', sku: 'PL-HK-909-WAL', price: 42.00, salePrice: 34.00, stockQuantity: 40 },
      { id: 'v-909-2', name: 'Brass Lids Set of 3', sku: 'PL-HK-909-BRS', price: 48.00, salePrice: 39.00, stockQuantity: 28 }
    ],
    specifications: {
      'Included Sizes': '250ml (Small), 500ml (Medium), 1000ml (Large)',
      'Glass Type': 'UV-Filtering Amber Borosilicate',
      'Seal': 'BPA-Free Silicone Gasket'
    },
    metaTitle: 'Minimalist Amber Glass Apothecary Jars | PURELIS Home',
    metaDescription: 'Set of 3 UV-blocking amber glass storage jars with wooden lids.',
    createdAt: '2025-01-30T10:00:00Z',
    updatedAt: '2025-02-17T12:00:00Z'
  },
  {
    id: 'prod-10',
    name: 'Ultrasonic Ceramic Stone Aromatherapy Diffuser',
    slug: 'ultrasonic-ceramic-stone-diffuser',
    sku: 'PL-HK-1010',
    shortDescription: 'Matte ceramic ultrasonic essential oil diffuser with ambient warm light.',
    description: 'Transform your space into a peaceful botanical sanctuary. Features a hand-molded porcelain ceramic shell, whisper-quiet ultrasonic atomization, 2 mist modes (continuous 4hr & intermittent 8hr), and optional soothing ambient amber glow.',
    price: 65.00,
    salePrice: 52.00,
    costPrice: 14.50,
    stockQuantity: 58,
    lowStockThreshold: 10,
    categoryId: 'cat-home-decor',
    categoryName: 'Home & Living',
    subcategoryId: 'sub-aromatherapy',
    subcategoryName: 'Diffusers & Aromatics',
    brand: 'PURELIS Home',
    department: 'home-kitchen',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.94,
    reviewCount: 119,
    volumeOrWeight: '120 ml capacity / Covers up to 500 sq ft',
    benefits: [
      'Hydrates dry air while naturally scenting without heat',
      'Automatic shut-off when water level is low',
      'Whisper-silent ultrasonic vibrations (<20dB)',
      'Handcrafted textured ceramic cover with matte finish'
    ],
    howToUse: 'Fill water tank to max line. Add 5-8 drops of 100% pure essential oil. Select continuous or interval mist mode.',
    variants: [
      { id: 'v-1010-1', name: 'Terracotta Matte', sku: 'PL-HK-1010-TER', price: 65.00, salePrice: 52.00, stockQuantity: 30 },
      { id: 'v-1010-2', name: 'Sage Stone', sku: 'PL-HK-1010-SAG', price: 65.00, salePrice: 52.00, stockQuantity: 28 }
    ],
    specifications: {
      'Water Tank': '120 ml BPA-Free',
      'Coverage': 'Up to 500 sq ft',
      'Power': 'USB-C Cable & Wall Adapter Included'
    },
    metaTitle: 'Ultrasonic Ceramic Stone Diffuser | PURELIS Home',
    metaDescription: 'Whisper-quiet porcelain stone essential oil diffuser for home wellness.',
    createdAt: '2025-02-01T12:00:00Z',
    updatedAt: '2025-02-21T18:00:00Z'
  },
  {
    id: 'prod-11',
    name: 'Washed French Organic Linen Kitchen Towels (Set of 4)',
    slug: 'french-organic-linen-kitchen-towels-set-of-4',
    sku: 'PL-HK-1111',
    shortDescription: 'Pre-washed 100% European flax absorbent dish and tea towels.',
    description: 'Woven from 100% certified European flax linen, these generously sized kitchen towels become softer and more absorbent with every wash. Naturally lint-free, hypoallergenic, and quick-drying, they add timeless rustic charm to your kitchen.',
    price: 38.00,
    salePrice: 29.00,
    costPrice: 8.20,
    stockQuantity: 84,
    lowStockThreshold: 15,
    categoryId: 'cat-home-decor',
    categoryName: 'Home & Living',
    subcategoryId: 'sub-linens',
    subcategoryName: 'Organic Linens',
    brand: 'PURELIS Home',
    department: 'home-kitchen',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: true,
    rating: 4.89,
    reviewCount: 38,
    volumeOrWeight: 'Set of 4 (20" x 28" each)',
    benefits: [
      '100% European Flax Linen (OEKO-TEX Certified)',
      'Super-absorbent and dries 3x faster than cotton',
      'Naturally antibacterial and lint-free for streak-free glassware',
      'Includes stitched twill hanging loop on each towel'
    ],
    howToUse: 'Machine wash warm with mild detergent. Tumble dry on low or line dry for natural textured drape.',
    variants: [
      { id: 'v-1111-1', name: 'Earthy Sage & Cream Assortment', sku: 'PL-HK-1111-SAG', price: 38.00, salePrice: 29.00, stockQuantity: 50 },
      { id: 'v-1111-2', name: 'Oatmeal Natural Flax', sku: 'PL-HK-1111-OAT', price: 38.00, salePrice: 29.00, stockQuantity: 34 }
    ],
    specifications: {
      'Fabric': '100% Certified European Flax Linen',
      'Dimensions': '20 x 28 inches per towel',
      'Set Count': '4 Matching & Complementary Towels'
    },
    metaTitle: 'French Organic Linen Kitchen Towels | PURELIS Home',
    metaDescription: 'Set of 4 absorbent pure French linen tea towels with hanging loops.',
    createdAt: '2025-02-03T16:00:00Z',
    updatedAt: '2025-02-19T09:00:00Z'
  },
  {
    id: 'prod-12',
    name: 'AHA Clarifying Blemish Clearing Toner',
    slug: 'aha-clarifying-blemish-toner',
    sku: 'PL-SK-1212',
    shortDescription: '7% Glycolic + Willow Bark exfoliating essence with witch hazel & zinc.',
    description: 'An alcohol-free resurfacing treatment toner that gently sweeps away dead skin cells, decongests enlarged pores, and rebalances oil production. Infused with soothing witch hazel, zinc PCA, and organic cucumber hydrosol to soothe while refining.',
    price: 32.00,
    salePrice: 26.00,
    costPrice: 6.80,
    stockQuantity: 120,
    lowStockThreshold: 20,
    categoryId: 'cat-cleansers',
    categoryName: 'Cleansers',
    subcategoryId: 'sub-exfoliators',
    subcategoryName: 'Gentle Exfoliators',
    brand: 'PURELIS Science',
    department: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1608248597359-54845520d235?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.87,
    reviewCount: 83,
    volumeOrWeight: '150 ml / 5.1 fl. oz bottle',
    ingredients: [
      'Glycolic Acid (AHA 7%)',
      'Salix Alba (Willow Bark) Extract (Natural BHA)',
      'Hamamelis Virginiana (Witch Hazel) Water',
      'Zinc PCA',
      'Centella Asiatica Extract',
      'Cucumis Sativus (Cucumber) Fruit Water'
    ],
    benefits: [
      'Unclogs pores and smooths rough skin texture',
      'Minimizes the appearance of enlarged pores',
      'Zero sting, redness, or alcohol-induced dryness',
      'Prepares skin for optimal serum penetration'
    ],
    howToUse: 'Saturate a reusable organic cotton pad and sweep across face and neck after cleansing. Use 2-3 nights per week.',
    variants: [
      { id: 'v-1212-1', name: '150ml Bottle', sku: 'PL-SK-1212-150', price: 32.00, salePrice: 26.00, stockQuantity: 120 }
    ],
    specifications: {
      'AHA Concentration': '7% pH 3.8',
      'Skin Types': 'Combination, Oily, Blemish-Prone',
      'Alcohol Free': 'Yes'
    },
    metaTitle: 'AHA Clarifying Blemish Toner | PURELIS Skincare',
    metaDescription: 'Gentle exfoliating 7% Glycolic Acid & Willow Bark toner.',
    createdAt: '2025-02-05T09:00:00Z',
    updatedAt: '2025-02-22T14:00:00Z'
  }
];

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-summer-glow',
    title: 'Summer Glow Essentials',
    slug: 'summer-glow',
    subtitle: 'Sun-drenched botanical hydration & mineral protection',
    description: 'Our curated collection of antioxidant serums, mineral SPF 50, and sheer tinted balms designed for luminous summer radiance.',
    bannerImage: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1600&q=80',
    productIds: ['prod-02', 'prod-04', 'prod-05', 'prod-01'],
    status: 'active',
    featured: true,
    discountBadge: 'Save up to 20%'
  },
  {
    id: 'col-skin-barrier',
    title: 'Barrier Repair & Hydration',
    slug: 'barrier-repair',
    subtitle: 'Ceramides, peptides, and soothing botanical comfort',
    description: 'Restore calm, banish dryness, and protect your vital acid mantle with clinical multi-ceramides.',
    bannerImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1600&q=80',
    productIds: ['prod-01', 'prod-03', 'prod-06', 'prod-12'],
    status: 'active',
    featured: true,
    discountBadge: 'Bestseller Routine'
  },
  {
    id: 'col-artisan-kitchen',
    title: 'Mindful Kitchen & Living',
    slug: 'mindful-kitchen',
    subtitle: 'Heirloom cookware, end-grain woods & organic linens',
    description: 'Elevate your daily culinary rituals with sustainable artisan pieces made to last generations.',
    bannerImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    productIds: ['prod-07', 'prod-08', 'prod-09', 'prod-10', 'prod-11'],
    status: 'active',
    featured: true,
    discountBadge: 'Curated Living'
  },
  {
    id: 'col-under-35',
    title: 'Gifts Under $35',
    slug: 'under-35',
    subtitle: 'Thoughtful everyday luxuries that delight',
    description: 'Affordable clean skincare favorites and handcrafted kitchen essentials under $35.',
    bannerImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1600&q=80',
    productIds: ['prod-01', 'prod-05', 'prod-11', 'prod-12'],
    status: 'active',
    featured: false,
    discountBadge: 'Budget Luxuries'
  }
];

const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-hero-main',
    title: 'NATURALLY PURE.\nBEAUTIFULLY YOU.',
    subtitle: 'Clean, effective & cruelty-free skincare enriched with nature\'s finest ingredients.',
    buttonText: 'SHOP NOW',
    buttonUrl: '/shop',
    desktopImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    tag: 'NEW BOTANICAL HARVEST',
    type: 'hero',
    status: 'active',
    order: 1
  },
  {
    id: 'ban-promo-sitewide',
    title: 'GOOD FOR YOUR SKIN.\nGOOD FOR THE PLANET.',
    subtitle: 'Up to 25% Off Sitewide with code PURE20',
    buttonText: 'EXPLORE OFFERS',
    buttonUrl: '/collection/summer-glow',
    desktopImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1600&q=80',
    tag: 'LIMITED TIME EVENT',
    type: 'promotional',
    status: 'active',
    order: 2
  }
];

const INITIAL_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Hero Banner Slider',
    active: true,
    order: 1,
    data: {
      headline: 'NATURALLY PURE.\nBEAUTIFULLY YOU.',
      subheadline: 'Clean, effective & cruelty-free skincare enriched with nature\'s finest ingredients.',
      ctaText: 'SHOP NOW',
      ctaUrl: '/shop'
    }
  },
  {
    id: 'sec-trust-badges',
    type: 'trust_badges',
    title: 'Trust & Purity Badges',
    active: true,
    order: 2,
    data: {
      badges: [
        { title: 'Natural Ingredients', subtitle: 'Safe & toxin-free botanicals', icon: 'Leaf' },
        { title: 'Clinically Tested', subtitle: 'Dermatologically proven results', icon: 'FlaskConical' },
        { title: 'Cruelty Free', subtitle: 'We never test on animals', icon: 'HeartHandshake' },
        { title: 'For All Skin Types', subtitle: 'Gentle, pH-balanced care', icon: 'Droplets' }
      ]
    }
  },
  {
    id: 'sec-categories',
    type: 'categories',
    title: 'SHOP BY CATEGORY',
    subtitle: '',
    active: true,
    order: 3,
    data: {
      department: 'all',
      limit: 6
    }
  },
  {
    id: 'sec-promo-banner',
    type: 'promo_banner',
    title: 'Sitewide Promotional Banner',
    subtitle: 'Up to 25% Off Sitewide',
    active: true,
    order: 4,
    data: {
      headline: 'GOOD FOR YOUR SKIN. GOOD FOR THE PLANET.',
      subheadline: 'Up to 25% Off Sitewide',
      ctaText: 'EXPLORE OFFERS',
      ctaUrl: '/shop?sale=true',
      code: 'PURE20'
    }
  },
  {
    id: 'sec-new-arrivals',
    type: 'new_arrivals',
    title: 'NEW ARRIVALS',
    subtitle: '',
    active: true,
    order: 5,
    data: {
      limit: 4,
      viewAllUrl: '/shop?sort=newest'
    }
  }
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-01',
    code: 'PURE20',
    description: '20% Off on all orders over $35',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 35.00,
    maxDiscountAmount: 40.00,
    usageLimit: 1000,
    usageCount: 142,
    perUserLimit: 1,
    startDate: '2025-01-01',
    expiryDate: '2026-12-31',
    status: 'active'
  },
  {
    id: 'cp-02',
    code: 'WELCOME10',
    description: '$10 Off on your first order over $50',
    discountType: 'fixed',
    discountValue: 10,
    minOrderAmount: 50.00,
    usageLimit: 5000,
    usageCount: 310,
    perUserLimit: 1,
    startDate: '2025-01-01',
    expiryDate: '2026-12-31',
    status: 'active'
  },
  {
    id: 'cp-03',
    code: 'GLOW25',
    description: '25% Off VIP promotion for skincare routines',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 75.00,
    maxDiscountAmount: 50.00,
    usageLimit: 200,
    usageCount: 88,
    perUserLimit: 1,
    startDate: '2025-02-01',
    expiryDate: '2026-06-30',
    status: 'active'
  }
];

const SEED_ADMIN_EMAIL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL) || 'admin@purelis.com';
const SEED_ADMIN_PASSWORD = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_PASSWORD) || 'Admin@Purelis2026!';

const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    userId: 'user-customer-1',
    productName: 'Calming Green Tea Face Wash',
    authorName: 'Amelia Chen',
    authorEmail: 'customer@purelis.com',
    rating: 5,
    title: 'Holy grail for sensitive skin!',
    comment: 'I have sensitive, reactive skin that reacts to almost every commercial cleanser. This green tea wash leaves my face calm, supple, and clean without any tightness. Absolutely in love with the natural botanical aroma.',
    verifiedPurchase: true,
    status: 'approved',
    featured: true,
    createdAt: '2025-02-10T14:20:00Z'
  },
  {
    id: 'rev-02',
    productId: 'prod-02',
    userId: 'user-customer-1',
    productName: 'Vitamin C Brightening Serum',
    authorName: 'Amelia Chen',
    authorEmail: 'customer@purelis.com',
    rating: 5,
    title: 'Dark spots faded in two weeks!',
    comment: 'The lipid-soluble Vitamin C is a game changer. No tingling or peeling, just instant glow and my acne pigmentation is visibly fading.',
    verifiedPurchase: true,
    status: 'approved',
    featured: true,
    createdAt: '2025-02-14T09:15:00Z'
  },
  {
    id: 'rev-03',
    productId: 'prod-07',
    productName: 'Cast Iron Enamelled Dutch Oven',
    authorName: 'David Sterling',
    authorEmail: 'david.s@example.com',
    rating: 5,
    title: 'Bakes perfect sourdough loaves',
    comment: 'The steam retention inside this pot is magnificent. My sourdough bread gets the crispest crust and incredible oven spring. The sage color is stunning on our open shelving.',
    verifiedPurchase: true,
    status: 'approved',
    featured: true,
    createdAt: '2025-02-16T18:40:00Z'
  }
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'PURELIS',
  storeTagline: 'Clean Beauty & Mindful Living Essentials',
  logoUrl: '',
  currency: 'INR',
  currencySymbol: '₹',
  supportEmail: 'care@purelislife.com',
  supportPhone: '+1 (800) 555-7873',
  storeAddress: '742 Evergreen Botanical Way, Suite 400, Portland, OR 97201',
  freeShippingThreshold: 499.00,
  standardShippingFee: 50.00,
  expressShippingFee: 100.00,
  taxRatePercentage: 5.0,
  stripePublishableKey: 'pk_test_51MockPurelisStripeKey990141',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  announcementText: 'Free shipping on orders over ₹499 | Use code: PURE20 for 20% OFF 🌿',
  announcementActive: true,
  announcementCoupon: 'PURE20',
  policies: {
    privacyPolicy: `At PURELIS, we respect your privacy and are committed to protecting your personal information. We collect personal details such as your name, email address, shipping address, and phone number when you place an order or create an account. We use this information solely to fulfill orders, provide customer service, and send curated updates with your consent. We never sell or rent your data to third parties.`,
    termsAndConditions: `By accessing or purchasing from PURELIS, you agree to our terms of service. All prices are stated in USD and are subject to applicable taxes. We strive to present all product descriptions, colors, and ingredients with maximum accuracy. We reserve the right to cancel orders in the event of unforeseen pricing or inventory errors.`,
    shippingPolicy: `Orders are carefully packaged and dispatched within 1-2 business days from our climate-controlled botanical facility. Standard domestic delivery takes 3-5 business days. Complimentary standard shipping is automatically applied at checkout to all domestic orders over $50. Tracking information is sent via email once your package departs.`,
    refundPolicy: `We stand 100% behind the purity and quality of every formula and home piece. If you are not completely enchanted with your purchase, you may return the item within 30 days of delivery for a full refund or exchange. To initiate a return, contact our concierge team at care@purelislife.com.`
  }
};

const INITIAL_USERS: User[] = [
  {
    id: 'user-superadmin',
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: SEED_ADMIN_EMAIL,
    password: SEED_ADMIN_PASSWORD,
    phone: '+1 (555) 123-4567',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-manager',
    firstName: 'Julian',
    lastName: 'Hayes',
    email: 'manager@purelis.com',
    password: 'Manager@Purelis2026!',
    phone: '+1 (555) 234-5678',
    role: 'manager',
    status: 'active',
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z'
  },
  {
    id: 'user-staff',
    firstName: 'Chloe',
    lastName: 'Nguyen',
    email: 'staff@purelis.com',
    password: 'Staff@Purelis2026!',
    phone: '+1 (555) 345-6789',
    role: 'staff',
    status: 'active',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 'user-customer-1',
    firstName: 'Amelia',
    lastName: 'Chen',
    email: 'customer@purelis.com',
    password: 'Customer@123!',
    phone: '+1 (555) 987-6543',
    role: 'customer',
    status: 'active',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  }
];

const INITIAL_SAVED_CARDS: SavedPaymentCard[] = [
  {
    id: 'card-01',
    userId: 'user-customer-1',
    cardHolder: 'Amelia Chen',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: '12',
    expiryYear: '28',
    isDefault: true,
    createdAt: '2025-01-20T00:00:00Z'
  },
  {
    id: 'card-02',
    userId: 'user-customer-1',
    cardHolder: 'Amelia Chen',
    last4: '8888',
    brand: 'Mastercard',
    expiryMonth: '09',
    expiryYear: '27',
    isDefault: false,
    createdAt: '2025-02-15T00:00:00Z'
  }
];

const INITIAL_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-01',
    userId: 'user-customer-1',
    name: 'Amelia Chen',
    phone: '+1 (555) 987-6543',
    addressLine1: '450 California Street',
    addressLine2: 'Apt 12B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94104',
    country: 'United States',
    isDefault: true
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'PL-89421',
    userId: 'user-customer-1',
    customerName: 'Amelia Chen',
    customerEmail: 'customer@purelis.com',
    customerPhone: '+1 (555) 987-6543',
    shippingAddress: {
      id: 'addr-01',
      userId: 'user-customer-1',
      name: 'Amelia Chen',
      phone: '+1 (555) 987-6543',
      addressLine1: '450 California Street',
      addressLine2: 'Apt 12B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94104',
      country: 'United States',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-01',
        productName: 'Calming Green Tea Face Wash',
        productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        sku: 'PL-SK-101-STD',
        variantName: '150ml Standard',
        quantity: 1,
        unitPrice: 28.00,
        totalPrice: 28.00
      },
      {
        productId: 'prod-02',
        productName: 'Vitamin C Brightening Serum + Niacinamide',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        sku: 'PL-SK-202-30',
        variantName: '30ml Dropper',
        quantity: 1,
        unitPrice: 48.00,
        totalPrice: 48.00
      }
    ],
    subtotal: 76.00,
    discountAmount: 15.20,
    couponCode: 'PURE20',
    shippingAmount: 0.00,
    taxAmount: 4.56,
    grandTotal: 65.36,
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    stripePaymentIntentId: 'pi_test_3N8x79PurelisPay',
    status: 'Delivered',
    trackingNumber: 'TRK-984210492US',
    carrier: 'USPS Priority Botanicals',
    notes: 'Customer requested eco-friendly packaging only.',
    statusHistory: [
      { status: 'Pending', timestamp: '2025-02-10T11:00:00Z', note: 'Order placed via online checkout' },
      { status: 'Paid', timestamp: '2025-02-10T11:02:00Z', note: 'Stripe payment verified via webhook' },
      { status: 'Processing', timestamp: '2025-02-10T14:30:00Z', note: 'Order batched to fulfillment' },
      { status: 'Packed', timestamp: '2025-02-11T09:15:00Z', note: 'Handcrafted in eco-padded shipper' },
      { status: 'Shipped', timestamp: '2025-02-11T16:00:00Z', note: 'Carrier USPS accepted package' },
      { status: 'Delivered', timestamp: '2025-02-13T13:45:00Z', note: 'Delivered to front porch / lobby' }
    ],
    createdAt: '2025-02-10T11:00:00Z',
    updatedAt: '2025-02-13T13:45:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'PL-89422',
    userId: 'cust-2',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@example.com',
    customerPhone: '+1 (555) 777-8899',
    shippingAddress: {
      id: 'addr-02',
      userId: 'cust-2',
      name: 'Marcus Vance',
      phone: '+1 (555) 777-8899',
      addressLine1: '1204 South Congress Ave',
      city: 'Austin',
      state: 'TX',
      postalCode: '78704',
      country: 'United States',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-07',
        productName: 'Cast Iron Enamelled Dutch Oven - Sage Green (5.5 Qt)',
        productImage: 'https://images.unsplash.com/photo-1584990347449-397cf1e4a3b8?auto=format&fit=crop&w=800&q=80',
        sku: 'PL-HK-707-SAGE',
        variantName: '5.5 Qt Sage Green',
        quantity: 1,
        unitPrice: 139.00,
        totalPrice: 139.00
      }
    ],
    subtotal: 139.00,
    discountAmount: 20.00,
    couponCode: 'PURE20',
    shippingAmount: 0.00,
    taxAmount: 8.92,
    grandTotal: 127.92,
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    stripePaymentIntentId: 'pi_test_4M9y88PurelisPay',
    status: 'Shipped',
    trackingNumber: 'UPS-8371902814',
    carrier: 'UPS Carbon-Neutral Ground',
    statusHistory: [
      { status: 'Pending', timestamp: '2025-02-21T08:00:00Z', note: 'Order placed' },
      { status: 'Paid', timestamp: '2025-02-21T08:02:00Z', note: 'Stripe charge successful' },
      { status: 'Processing', timestamp: '2025-02-21T10:00:00Z', note: 'Dispatched to packaging' },
      { status: 'Packed', timestamp: '2025-02-21T14:30:00Z', note: 'Securely packaged with heavy-duty rim guards' },
      { status: 'Shipped', timestamp: '2025-02-22T09:00:00Z', note: 'In transit with UPS' }
    ],
    createdAt: '2025-02-21T08:00:00Z',
    updatedAt: '2025-02-22T09:00:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'PL-89423',
    customerName: 'Claire Dupont',
    customerEmail: 'claire.d@example.com',
    customerPhone: '+1 (555) 444-3322',
    shippingAddress: {
      id: 'addr-03',
      userId: 'guest',
      name: 'Claire Dupont',
      phone: '+1 (555) 444-3322',
      addressLine1: '78 5th Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10011',
      country: 'United States',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-03',
        productName: 'Hydra Barrier Peptide Moisturizer',
        productImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        sku: 'PL-SK-303-50',
        variantName: '50ml Glass Jar',
        quantity: 2,
        unitPrice: 38.00,
        totalPrice: 76.00
      }
    ],
    subtotal: 76.00,
    discountAmount: 10.00,
    couponCode: 'WELCOME10',
    shippingAmount: 0.00,
    taxAmount: 4.95,
    grandTotal: 70.95,
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    stripePaymentIntentId: 'pi_test_5P7z99PurelisPay',
    status: 'Processing',
    statusHistory: [
      { status: 'Pending', timestamp: '2025-02-23T14:10:00Z' },
      { status: 'Paid', timestamp: '2025-02-23T14:12:00Z' },
      { status: 'Processing', timestamp: '2025-02-23T16:00:00Z', note: 'Quality check in progress' }
    ],
    createdAt: '2025-02-23T14:10:00Z',
    updatedAt: '2025-02-23T16:00:00Z'
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'user-customer-1',
    name: 'Amelia Chen',
    email: 'customer@purelis.com',
    phone: '+1 (555) 987-6543',
    role: 'customer',
    status: 'vip',
    totalOrders: 6,
    totalSpent: 482.50,
    lastOrderDate: '2025-02-10',
    segments: ['VIP Customer', 'Skincare Routine Lover', 'High Value'],
    registeredAt: '2024-11-12',
    notes: [
      {
        id: 'note-1',
        customerId: 'user-customer-1',
        authorName: 'Eleanor Vance (Admin)',
        note: 'Customer prefers fragrance-free & gentle formula recommendations. VIP concierge tier.',
        createdAt: '2025-01-20T10:00:00Z'
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    phone: '+1 (555) 777-8899',
    role: 'customer',
    status: 'active',
    totalOrders: 3,
    totalSpent: 295.00,
    lastOrderDate: '2025-02-21',
    segments: ['Kitchen & Home Lover', 'Returning Customer'],
    registeredAt: '2024-12-05',
    notes: [
      {
        id: 'note-2',
        customerId: 'cust-2',
        authorName: 'Julian Hayes (Manager)',
        note: 'Enamelled cookware collector. Send upcoming brass collection previews.',
        createdAt: '2025-02-21T09:30:00Z'
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    phone: '+1 (555) 321-7654',
    role: 'customer',
    status: 'active',
    totalOrders: 2,
    totalSpent: 134.00,
    lastOrderDate: '2025-02-08',
    segments: ['Sensitive Skin', 'Verified Reviewer'],
    registeredAt: '2025-01-08',
    notes: []
  }
];

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-01',
    title: 'The Science of the Moisture Barrier: Why Ceramides & Peptides Are Non-Negotiable',
    slug: 'the-science-of-the-moisture-barrier',
    excerpt: 'Understand how your skin\'s lipid layer protects against pollution, trans-epidermal water loss, and sensitivity.',
    content: `Your skin barrier, known scientifically as the stratum corneum, is your body's primary protective shield against environmental pollutants, oxidative stress, and moisture loss. When the lipid matrix (comprised of 50% ceramides, 25% cholesterol, and 15% free fatty acids) is compromised through harsh cleansers, extreme climate changes, or over-exfoliation, skin becomes prone to redness, irritation, and dullness.\n\n### How Ceramides Restore Harmony\nCeramides act as the structural "mortar" between your cellular skin "bricks". By replenishing bio-identical ceramides (specifically Ceramide NP, AP, and EOP), you rebuild the intercellular cement, allowing skin to retain critical hydration for up to 72 hours.\n\n### Peptides: The Cellular Messengers\nSignal peptides trigger the skin to generate collagen and elastin naturally. Paired with cold-pressed botanical oils like Marula and Jojoba, your morning and evening skincare ritual becomes a comforting sanctuary for compromised complexions.`,
    coverImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80',
    author: 'Dr. Evelyn Carter, Botanical Dermatologist',
    category: 'Skincare Science',
    tags: ['Ceramides', 'Peptides', 'Barrier Repair', 'Clean Beauty'],
    status: 'published',
    publishedAt: '2025-02-01T10:00:00Z',
    readTime: '5 min read'
  },
  {
    id: 'blog-02',
    title: 'Seasoning & Caring for Artisan Enameled Cast Iron & Hardwoods',
    slug: 'caring-for-enameled-cast-iron-hardwoods',
    excerpt: 'Simple maintenance rituals to ensure your culinary heirloom pieces last generations.',
    content: `Enameled cast iron is beloved by Michelin chefs and home cooks alike for its peerless heat retention and non-reactive glossy interior. Unlike raw cast iron, quality vitreous enamel never requires seasoning, allowing you to simmer acidic tomato sauces and delicate citrus reductions with ease.\n\n### Daily Cleaning Rituals\nAlways allow your Dutch oven to cool to room temperature before washing. Thermal shock can cause fine micro-crazing in enamel. Use warm water, mild plant-based dish soap, and a soft coconut fiber sponge.\n\n### Acacia Wood Care\nFor wooden cutting blocks and salad servers, rub food-grade mineral oil or organic beeswax into the grain monthly. This seals against moisture, prevents warping, and enriches the golden amber grain.`,
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    author: 'Chef Mateo Silva',
    category: 'Home & Kitchen',
    tags: ['Cookware', 'Kitchen Care', 'Sustainable Living', 'Acacia Wood'],
    status: 'published',
    publishedAt: '2025-02-12T14:00:00Z',
    readTime: '4 min read'
  },
  {
    id: 'blog-03',
    title: 'Why Non-Nano Zinc Oxide is the Gold Standard in Sun Protection',
    slug: 'why-non-nano-zinc-oxide-is-gold-standard',
    excerpt: 'Protecting your skin and delicate marine ecosystems with clean mineral filters.',
    content: `Not all sunscreens are created equal. Chemical filters like oxybenzone and octinoxate absorb UV radiation through chemical conversion, which can create heat within the skin and has been shown to bleach coral reefs.\n\nNon-nano zinc oxide works as a physical botanical shield, sitting gently atop your skin to reflect UVA and UVB rays away like microscopic mirrors. Because the particles are non-nano (>100nm), they cannot penetrate the bloodstream or disrupt marine biology, making them the gold standard for both your skin and our oceans.`,
    coverImage: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1200&q=80',
    author: 'Claire Vance, Formulation Chemist',
    category: 'Eco-Living & Sun Care',
    tags: ['Mineral SPF', 'Reef Safe', 'Zinc Oxide', 'Clean Beauty'],
    status: 'published',
    publishedAt: '2025-02-18T09:00:00Z',
    readTime: '6 min read'
  }
];

function getItem<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Helper database manager with localStorage persistence
export const mockDb = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.resetToDefaults();
    }
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(INITIAL_COLLECTIONS));
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
    localStorage.setItem(STORAGE_KEYS.HOMEPAGE_SECTIONS, JSON.stringify(INITIAL_HOMEPAGE_SECTIONS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(INITIAL_BLOG_POSTS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(INITIAL_ADDRESSES));
  },

  // Products
  getProducts(): Product[] {
    return getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  getProductById(idOrSlug: string): Product | undefined {
    if (!idOrSlug) return undefined;
    const clean = decodeURIComponent(idOrSlug).trim().toLowerCase();
    const prods = this.getProducts();
    let found = prods.find(p => 
      p.id.toLowerCase() === clean || 
      p.slug.toLowerCase() === clean ||
      p.sku?.toLowerCase() === clean ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === clean ||
      p.slug.toLowerCase().includes(clean) ||
      clean.includes(p.slug.toLowerCase())
    );
    if (found) return found;

    // Fallback to INITIAL_PRODUCTS in case localStorage has older subset
    return INITIAL_PRODUCTS.find(p => 
      p.id.toLowerCase() === clean || 
      p.slug.toLowerCase() === clean ||
      p.sku?.toLowerCase() === clean ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === clean ||
      p.slug.toLowerCase().includes(clean) ||
      clean.includes(p.slug.toLowerCase())
    );
  },
  saveProduct(product: Partial<Product> & { id?: string }): Product {
    const products = this.getProducts();
    const now = new Date().toISOString();
    let saved: Product;

    if (product.id && products.some(p => p.id === product.id)) {
      const existing = products.find(p => p.id === product.id)!;
      saved = {
        ...existing,
        ...product,
        updatedAt: now
      };
      const updated = products.map(p => p.id === product.id ? saved : p);
      setItem(STORAGE_KEYS.PRODUCTS, updated);
    } else {
      const newId = `prod-${Date.now()}`;
      saved = {
        id: newId,
        name: product.name || 'New Product',
        slug: product.slug || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${Date.now()}`),
        sku: product.sku || `PL-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        price: Number(product.price) || 0,
        salePrice: product.salePrice ? Number(product.salePrice) : undefined,
        costPrice: product.costPrice ? Number(product.costPrice) : undefined,
        stockQuantity: Number(product.stockQuantity) || 0,
        lowStockThreshold: Number(product.lowStockThreshold) || 10,
        categoryId: product.categoryId || 'cat-cleansers',
        categoryName: product.categoryName || 'Cleansers',
        subcategoryId: product.subcategoryId,
        subcategoryName: product.subcategoryName,
        brand: product.brand || 'PURELIS Botanical',
        department: product.department || 'beauty',
        images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'],
        videoUrl: product.videoUrl,
        status: product.status || 'active',
        featured: Boolean(product.featured),
        bestseller: Boolean(product.bestseller),
        newArrival: Boolean(product.newArrival),
        rating: 5.0,
        reviewCount: 0,
        volumeOrWeight: product.volumeOrWeight || '',
        ingredients: product.ingredients || [],
        specifications: product.specifications || {},
        benefits: product.benefits || [],
        howToUse: product.howToUse || '',
        variants: product.variants || [
          { id: `v-${Date.now()}`, name: 'Standard', sku: product.sku || 'SKU-1', price: Number(product.price) || 0, stockQuantity: Number(product.stockQuantity) || 0 }
        ],
        metaTitle: product.metaTitle || product.name,
        metaDescription: product.metaDescription || product.shortDescription,
        createdAt: now,
        updatedAt: now
      };
      setItem(STORAGE_KEYS.PRODUCTS, [saved, ...products]);
    }
    return saved;
  },
  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    setItem(STORAGE_KEYS.PRODUCTS, products);
  },

  // Categories
  getCategories(): Category[] {
    return getItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategory(category: Partial<Category> & { id?: string }): Category {
    const categories = this.getCategories();
    let saved: Category;
    if (category.id && categories.some(c => c.id === category.id)) {
      saved = { ...categories.find(c => c.id === category.id)!, ...category };
      setItem(STORAGE_KEYS.CATEGORIES, categories.map(c => c.id === category.id ? saved : c));
    } else {
      saved = {
        id: `cat-${Date.now()}`,
        name: category.name || 'New Category',
        slug: category.slug || (category.name ? category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `cat-${Date.now()}`),
        description: category.description || '',
        department: category.department || 'beauty',
        image: category.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        bannerImage: category.bannerImage || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
        status: category.status || 'active',
        displayOrder: categories.length + 1,
        subcategories: category.subcategories || []
      };
      setItem(STORAGE_KEYS.CATEGORIES, [...categories, saved]);
    }
    return saved;
  },
  deleteCategory(id: string): void {
    setItem(STORAGE_KEYS.CATEGORIES, this.getCategories().filter(c => c.id !== id));
  },

  // Collections
  getCollections(): Collection[] {
    return getItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
  },
  saveCollection(collection: Partial<Collection> & { id?: string }): Collection {
    const collections = this.getCollections();
    let saved: Collection;
    if (collection.id && collections.some(c => c.id === collection.id)) {
      saved = { ...collections.find(c => c.id === collection.id)!, ...collection };
      setItem(STORAGE_KEYS.COLLECTIONS, collections.map(c => c.id === collection.id ? saved : c));
    } else {
      saved = {
        id: `col-${Date.now()}`,
        title: collection.title || 'New Collection',
        slug: collection.slug || (collection.title ? collection.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `col-${Date.now()}`),
        subtitle: collection.subtitle,
        description: collection.description || '',
        bannerImage: collection.bannerImage || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
        productIds: collection.productIds || [],
        status: collection.status || 'active',
        featured: Boolean(collection.featured),
        discountBadge: collection.discountBadge
      };
      setItem(STORAGE_KEYS.COLLECTIONS, [...collections, saved]);
    }
    return saved;
  },
  deleteCollection(id: string): void {
    setItem(STORAGE_KEYS.COLLECTIONS, this.getCollections().filter(c => c.id !== id));
  },

  // Banners
  getBanners(): Banner[] {
    return getItem<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  },
  saveBanner(banner: Partial<Banner> & { id?: string }): Banner {
    const banners = this.getBanners();
    let saved: Banner;
    if (banner.id && banners.some(b => b.id === banner.id)) {
      saved = { ...banners.find(b => b.id === banner.id)!, ...banner };
      setItem(STORAGE_KEYS.BANNERS, banners.map(b => b.id === banner.id ? saved : b));
    } else {
      saved = {
        id: `ban-${Date.now()}`,
        title: banner.title || 'Banner Title',
        subtitle: banner.subtitle || '',
        ctaText: banner.ctaText || 'SHOP NOW',
        ctaLink: banner.ctaLink || '/shop',
        imageUrl: banner.imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
        desktopImage: banner.desktopImage || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
        mobileImage: banner.mobileImage,
        tag: banner.tag,
        placement: banner.placement || 'hero',
        type: banner.type || 'hero',
        status: banner.status || 'active',
        active: banner.active !== undefined ? banner.active : true,
        order: banners.length + 1
      };
      setItem(STORAGE_KEYS.BANNERS, [...banners, saved]);
    }
    return saved;
  },
  deleteBanner(id: string): void {
    setItem(STORAGE_KEYS.BANNERS, this.getBanners().filter(b => b.id !== id));
  },

  // Homepage Sections (CMS)
  getHomepageSections(): HomepageSection[] {
    return getItem<HomepageSection[]>(STORAGE_KEYS.HOMEPAGE_SECTIONS, INITIAL_HOMEPAGE_SECTIONS)
      .sort((a, b) => a.order - b.order);
  },
  saveHomepageSections(sections: HomepageSection[]): void {
    setItem(STORAGE_KEYS.HOMEPAGE_SECTIONS, sections);
  },
  saveHomepageSection(section: Partial<HomepageSection> & { id?: string }): HomepageSection {
    const sections = this.getHomepageSections();
    let saved: HomepageSection;
    if (section.id && sections.some(s => s.id === section.id)) {
      saved = { ...sections.find(s => s.id === section.id)!, ...section };
      setItem(STORAGE_KEYS.HOMEPAGE_SECTIONS, sections.map(s => s.id === section.id ? saved : s));
    } else {
      saved = {
        id: `sec-${Date.now()}`,
        type: section.type || 'custom_html',
        title: section.title || 'New Section',
        subtitle: section.subtitle,
        active: section.active !== undefined ? section.active : true,
        enabled: section.enabled !== undefined ? section.enabled : true,
        order: sections.length + 1,
        data: section.data || {}
      };
      setItem(STORAGE_KEYS.HOMEPAGE_SECTIONS, [...sections, saved]);
    }
    return saved;
  },
  deleteHomepageSection(id: string): void {
    setItem(STORAGE_KEYS.HOMEPAGE_SECTIONS, this.getHomepageSections().filter(s => s.id !== id));
  },

  // Orders
  getOrders(): Order[] {
    return getItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },
  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id || o.orderNumber === id);
  },
  createOrder(orderData: Partial<Order>): Order {
    const orders = this.getOrders();
    const orderNum = `PL-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: orderData.userId,
      customerId: orderData.customerId,
      customerName: orderData.customerName || 'Customer',
      customerEmail: orderData.customerEmail || 'customer@example.com',
      customerPhone: orderData.customerPhone || '',
      shippingAddress: orderData.shippingAddress!,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discountAmount: orderData.discountAmount || 0,
      couponCode: orderData.couponCode,
      shippingAmount: orderData.shippingAmount || 0,
      shippingMethod: orderData.shippingMethod || 'Standard Carbon-Neutral',
      taxAmount: orderData.taxAmount || 0,
      totalAmount: orderData.totalAmount || orderData.grandTotal || 0,
      grandTotal: orderData.grandTotal || orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'stripe_card',
      paymentStatus: orderData.paymentStatus || 'paid',
      fulfillmentStatus: orderData.fulfillmentStatus || 'unfulfilled',
      stripePaymentIntentId: orderData.stripePaymentIntentId || `pi_live_${Date.now()}`,
      status: 'Paid',
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      carrier: 'USPS Priority Eco',
      notes: orderData.notes,
      statusHistory: [
        { status: 'Pending', timestamp: now, note: 'Order created via checkout' },
        { status: 'Paid', timestamp: now, note: 'Payment verified successfully via Stripe' }
      ],
      createdAt: now,
      updatedAt: now
    };

    // Automatically reduce product inventory
    const products = this.getProducts();
    for (const item of newOrder.items) {
      const productIndex = products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        const prod = products[productIndex];
        const newQty = Math.max(0, prod.stockQuantity - item.quantity);
        products[productIndex] = { ...prod, stockQuantity: newQty };
      }
    }
    setItem(STORAGE_KEYS.PRODUCTS, products);

    // Save order
    setItem(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);
    return newOrder;
  },
  updateOrder(orderId: string, updates: Partial<Order>): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return undefined;

    const now = new Date().toISOString();
    const updated: Order = {
      ...order,
      ...updates,
      updatedAt: now
    };

    setItem(STORAGE_KEYS.ORDERS, orders.map(o => o.id === orderId ? updated : o));
    return updated;
  },
  updateOrderStatus(orderId: string, status: Order['status'], note?: string, trackingNumber?: string, carrier?: string): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return undefined;

    const now = new Date().toISOString();
    const updated: Order = {
      ...order,
      status,
      trackingNumber: trackingNumber || order.trackingNumber,
      carrier: carrier || order.carrier,
      fulfillmentStatus: status === 'Delivered' || status === 'Shipped' ? 'fulfilled' : order.fulfillmentStatus,
      updatedAt: now,
      statusHistory: [
        ...(order.statusHistory || []),
        { status, timestamp: now, note: note || `Status updated to ${status}` }
      ]
    };

    setItem(STORAGE_KEYS.ORDERS, orders.map(o => o.id === orderId ? updated : o));
    return updated;
  },

  // Coupons
  getCoupons(): Coupon[] {
    return getItem<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },
  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; error?: string; discountAmount: number } {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, error: 'Invalid promo code. Please check and try again.', discountAmount: 0 };
    }
    if (coupon.status === 'inactive' || coupon.isActive === false) {
      return { valid: false, error: 'This coupon code is no longer active.', discountAmount: 0 };
    }
    const expiry = coupon.expiresAt || coupon.expiryDate;
    if (expiry && new Date(expiry) < new Date()) {
      return { valid: false, error: 'This coupon code has expired.', discountAmount: 0 };
    }
    const minOrder = coupon.minimumSpend || coupon.minOrderAmount || 0;
    if (subtotal < minOrder) {
      return { valid: false, error: `Minimum order of $${minOrder.toFixed(2)} required for this coupon.`, discountAmount: 0 };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }
    discount = Math.min(discount, subtotal);

    return { valid: true, coupon, discountAmount: Number(discount.toFixed(2)) };
  },
  saveCoupon(coupon: Partial<Coupon> & { id?: string }): Coupon {
    const coupons = this.getCoupons();
    let saved: Coupon;
    if (coupon.id && coupons.some(c => c.id === coupon.id)) {
      saved = { ...coupons.find(c => c.id === coupon.id)!, ...coupon };
      setItem(STORAGE_KEYS.COUPONS, coupons.map(c => c.id === coupon.id ? saved : c));
    } else {
      saved = {
        id: `cp-${Date.now()}`,
        code: (coupon.code || 'PROMO').toUpperCase(),
        description: coupon.description || '',
        discountType: coupon.discountType || 'percentage',
        discountValue: Number(coupon.discountValue) || 10,
        minimumSpend: Number(coupon.minimumSpend || coupon.minOrderAmount) || 0,
        minOrderAmount: Number(coupon.minOrderAmount || coupon.minimumSpend) || 0,
        maxDiscountAmount: coupon.maxDiscountAmount ? Number(coupon.maxDiscountAmount) : undefined,
        usageLimit: Number(coupon.usageLimit || coupon.maxUses) || 500,
        maxUses: Number(coupon.maxUses || coupon.usageLimit) || 500,
        usageCount: 0,
        usedCount: 0,
        startDate: coupon.startDate || new Date().toISOString().split('T')[0],
        expiresAt: coupon.expiresAt || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        expiryDate: coupon.expiryDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
        status: coupon.status || 'active'
      };
      setItem(STORAGE_KEYS.COUPONS, [saved, ...coupons]);
    }
    return saved;
  },
  deleteCoupon(id: string): void {
    setItem(STORAGE_KEYS.COUPONS, this.getCoupons().filter(c => c.id !== id));
  },

  // Reviews
  getReviews(): ProductReview[] {
    return getItem<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  getProductReviews(productId: string): ProductReview[] {
    return this.getReviews().filter(r => r.productId === productId && (r.status === 'approved' || !r.status));
  },
  addReview(reviewData: Partial<ProductReview>): ProductReview {
    const reviews = this.getReviews();
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId!,
      productName: reviewData.productName,
      authorName: reviewData.authorName || 'Verified Buyer',
      authorEmail: reviewData.authorEmail || '',
      rating: Number(reviewData.rating) || 5,
      title: reviewData.title || '',
      comment: reviewData.comment || '',
      verifiedPurchase: true,
      status: 'approved',
      featured: Boolean(reviewData.featured),
      createdAt: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.REVIEWS, [newRev, ...reviews]);

    // Recalculate product rating
    const productReviews = this.getReviews().filter(r => r.productId === reviewData.productId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const products = this.getProducts();
    const pIdx = products.findIndex(p => p.id === reviewData.productId);
    if (pIdx !== -1) {
      products[pIdx].rating = Number(avgRating.toFixed(2));
      products[pIdx].reviewCount = productReviews.length;
      setItem(STORAGE_KEYS.PRODUCTS, products);
    }

    return newRev;
  },
  updateReviewStatus(id: string, status: ProductReview['status'], featured?: boolean): void {
    const reviews = this.getReviews();
    setItem(STORAGE_KEYS.REVIEWS, reviews.map(r => r.id === id ? { 
      ...r, 
      status, 
      featured: featured !== undefined ? featured : r.featured 
    } : r));
  },
  deleteReview(id: string): void {
    setItem(STORAGE_KEYS.REVIEWS, this.getReviews().filter(r => r.id !== id));
  },

  // Customers & CRM
  getCustomers(): Customer[] {
    return getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },
  getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find(c => c.id === id || c.email === id);
  },
  addCustomerNote(customerId: string, note: string, authorName: string = 'Staff'): CustomerNote {
    const customers = this.getCustomers();
    const newNote: CustomerNote = {
      id: `note-${Date.now()}`,
      customerId,
      authorName,
      note,
      createdAt: new Date().toISOString()
    };
    const updated = customers.map(c => {
      if (c.id === customerId) {
        return { ...c, notes: [newNote, ...(c.notes || [])] };
      }
      return c;
    });
    setItem(STORAGE_KEYS.CUSTOMERS, updated);
    return newNote;
  },
  updateCustomerSegments(customerId: string, segments: string[]): void {
    const customers = this.getCustomers();
    setItem(STORAGE_KEYS.CUSTOMERS, customers.map(c => c.id === customerId ? { ...c, segments } : c));
  },

  // Blog Posts (CMS)
  getBlogPosts(): BlogPost[] {
    return getItem<BlogPost[]>(STORAGE_KEYS.BLOG_POSTS, INITIAL_BLOG_POSTS);
  },
  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.getBlogPosts().find(b => b.slug === slug || b.id === slug);
  },
  saveBlogPost(post: Partial<BlogPost> & { id?: string }): BlogPost {
    const posts = this.getBlogPosts();
    let saved: BlogPost;
    if (post.id && posts.some(p => p.id === post.id)) {
      saved = { ...posts.find(p => p.id === post.id)!, ...post };
      setItem(STORAGE_KEYS.BLOG_POSTS, posts.map(p => p.id === post.id ? saved : p));
    } else {
      saved = {
        id: `blog-${Date.now()}`,
        title: post.title || 'New Article',
        slug: post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `article-${Date.now()}`),
        excerpt: post.excerpt || '',
        content: post.content || '',
        coverImage: post.coverImage || post.featuredImage || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
        featuredImage: post.featuredImage || post.coverImage || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
        author: post.author || post.authorName || 'PURELIS Editorial',
        authorName: post.authorName || post.author || 'PURELIS Editorial',
        category: post.category || 'Skincare Rituals',
        tags: post.tags || ['Botanicals', 'Clean Living'],
        status: post.status || 'published',
        published: post.published !== undefined ? post.published : true,
        publishedAt: new Date().toISOString(),
        readTime: post.readTime || '4 min read',
        readTimeMinutes: Number(post.readTimeMinutes) || 4
      };
      setItem(STORAGE_KEYS.BLOG_POSTS, [saved, ...posts]);
    }
    return saved;
  },
  deleteBlogPost(id: string): void {
    setItem(STORAGE_KEYS.BLOG_POSTS, this.getBlogPosts().filter(p => p.id !== id));
  },

  // Settings
  getSettings(): StoreSettings {
    return getItem<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  saveSettings(settings: Partial<StoreSettings>): StoreSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Users & Staff
  getUsers(): User[] {
    return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  saveUser(user: Partial<User> & { id?: string }): User {
    const users = this.getUsers();
    let saved: User;
    const now = new Date().toISOString();
    if (user.id && users.some(u => u.id === user.id)) {
      saved = { ...users.find(u => u.id === user.id)!, ...user, updatedAt: now };
      setItem(STORAGE_KEYS.USERS, users.map(u => u.id === user.id ? saved : u));
    } else {
      saved = {
        id: `user-${Date.now()}`,
        firstName: user.firstName || 'Staff',
        lastName: user.lastName || 'Member',
        email: user.email || 'staff@purelis.com',
        phone: user.phone || '',
        role: user.role || 'staff',
        status: user.status || 'active',
        createdAt: now,
        updatedAt: now
      };
      setItem(STORAGE_KEYS.USERS, [...users, saved]);
    }
    return saved;
  },
  deleteUser(id: string): void {
    setItem(STORAGE_KEYS.USERS, this.getUsers().filter(u => u.id !== id));
  },

  // User Addresses
  getAddresses(userId?: string): UserAddress[] {
    const addresses = getItem<UserAddress[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
    if (userId) {
      return addresses.filter(a => a.userId === userId);
    }
    return addresses;
  },
  saveAddress(address: Partial<UserAddress> & { id?: string }): UserAddress {
    const addresses = this.getAddresses();
    let saved: UserAddress;
    if (address.id && addresses.some(a => a.id === address.id)) {
      saved = { ...addresses.find(a => a.id === address.id)!, ...address };
      setItem(STORAGE_KEYS.ADDRESSES, addresses.map(a => a.id === address.id ? saved : a));
    } else {
      saved = {
        id: `addr-${Date.now()}`,
        userId: address.userId || 'user-customer-1',
        name: address.name || `${address.firstName || ''} ${address.lastName || ''}`.trim() || 'Customer Name',
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone || '+1 555-1234',
        addressLine1: address.addressLine1 || address.address1 || '',
        addressLine2: address.addressLine2 || address.address2,
        address1: address.address1 || address.addressLine1 || '',
        address2: address.address2 || address.addressLine2,
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || 'United States',
        isDefault: Boolean(address.isDefault)
      };
      setItem(STORAGE_KEYS.ADDRESSES, [...addresses, saved]);
    }
    return saved;
  },

  // Inventory Adjustments
  adjustInventory(productId: string, changeAmount: number, reason: InventoryLog['reason'], performedBy: string = 'Admin'): void {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const previousStock = product.stockQuantity;
    const newStock = Math.max(0, previousStock + changeAmount);
    product.stockQuantity = newStock;
    product.updatedAt = new Date().toISOString();

    setItem(STORAGE_KEYS.PRODUCTS, products);

    // Save log
    const logs = getItem<InventoryLog[]>(STORAGE_KEYS.INVENTORY_LOGS, []);
    const newLog: InventoryLog = {
      id: `inv-${Date.now()}`,
      productId,
      productName: product.name,
      sku: product.sku,
      changeAmount,
      reason,
      previousStock,
      newStock,
      performedBy,
      timestamp: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.INVENTORY_LOGS, [newLog, ...logs]);
  },
  getInventoryLogs(): InventoryLog[] {
    return getItem<InventoryLog[]>(STORAGE_KEYS.INVENTORY_LOGS, []);
  }
};

// Initialize on load
mockDb.init();
