import { Product, Category } from "@/types/catalog";

// Generate 50 static mock products
const generateMockProducts = (): Product[] => {
  const categories = [
    { id: 1, name: "Streetwear", slug: "streetwear", description: "", parent: null },
    { id: 2, name: "Essentials", slug: "essentials", description: "", parent: null },
    { id: 3, name: "Accessories", slug: "accessories", description: "", parent: null }
  ];
  
  const images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"
  ];

  const products: Product[] = [];
  for (let i = 1; i <= 50; i++) {
    const category = categories[i % categories.length];
    products.push({
      id: i,
      name: `Premium Item ${i}`,
      slug: `premium-item-${i}`,
      description: `This is a high quality ${category.name} item designed for the modern wardrobe. Style number ${i}.`,
      category: category,
      brand: { id: 1, name: "Burhani", slug: "burhani" },
      is_active: true,
      rating: parseFloat((4 + Math.random()).toFixed(1)),
      material: i % 2 === 0 ? "100% Cotton" : "Premium Blend",
      delivery_days: 3,
      warranty_years: 1,
      variants: [
        { id: i, product: i, sku: `ITM-${i}`, color_name: "Standard", size: 1, size_name: "L", selling_price: (20 + (i * 2.5)).toFixed(2), weight: "0.2", is_active: true, upc: "" }
      ],
      media: [
        { 
          id: i, 
          media_file: { id: String(i), file: "", file_type: "image", webp_version: "", thumbnail: "", alt_text: "" }, 
          is_primary: true, 
          order: 1, 
          webp_url: images[i % images.length],
          thumbnail_url: images[i % images.length],
          original_url: images[i % images.length]
        }
      ]
    });
  }
  
  // Hardcode the specific ones requested before so they don't break existing hardcoded links
  products[0].name = "Oversized Heavyweight Tee";
  products[0].slug = "oversized-heavyweight-tee";
  products[1].name = "Essential Silk Kurti";
  products[1].slug = "essential-silk-kurti";
  products[2].name = "Tailored Wide-Leg Trousers";
  products[2].slug = "tailored-wide-leg-trousers";
  
  return products;
};

export const MOCK_PRODUCTS = generateMockProducts();

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Streetwear', slug: 'streetwear', description: '', parent: null },
  { id: 2, name: 'Essentials', slug: 'essentials', description: '', parent: null },
  { id: 3, name: 'Accessories', slug: 'accessories', description: '', parent: null }
];
