import { NextResponse } from 'next/server';

// Generate 50 static mock products
const generateMockProducts = () => {
  const categories = [
    { id: 1, name: "Streetwear", slug: "streetwear" },
    { id: 2, name: "Essentials", slug: "essentials" },
    { id: 3, name: "Accessories", slug: "accessories" }
  ];
  
  const images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"
  ];

  const products = [];
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
      rating: (4 + Math.random()).toFixed(1),
      material: i % 2 === 0 ? "100% Cotton" : "Premium Blend",
      delivery_days: 3,
      warranty_years: 1,
      variants: [
        { id: i, product: i, sku: `ITM-${i}`, color_name: "Standard", size: 1, size_name: "L", selling_price: (20 + (i * 2.5)).toFixed(2), weight: "0.2", is_active: true }
      ],
      media: [
        { 
          id: i, 
          media_file: { id: String(i), file: "", file_type: "image" }, 
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

const MOCK_PRODUCTS = generateMockProducts();

const MOCK_CATEGORIES = [
  { id: 1, name: 'Streetwear', slug: 'streetwear', description: '', parent: null },
  { id: 2, name: 'Essentials', slug: 'essentials', description: '', parent: null },
  { id: 3, name: 'Accessories', slug: 'accessories', description: '', parent: null }
];

// --- MOCK IN-MEMORY STATE ---
let mockCartItems: any[] = [];
let mockCartTotal = 0;

export async function GET(request: Request, props: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await props.params;
    if (!params || !params.path) return NextResponse.json({ message: "No path" });
    
    // Normalize path
    const segments = params.path.filter(p => p.length > 0);
    const path = segments.join('/');
    
    // 1. Catalog Products (List) with filtering
    if (path === 'catalog/products') {
      const url = new URL(request.url);
      let filtered = [...MOCK_PRODUCTS];
      const category = url.searchParams.get('category');
      const brand = url.searchParams.get('brand');
      const color = url.searchParams.get('color');
      const size = url.searchParams.get('size');

      if (category) filtered = filtered.filter(p => p.category?.slug === category);
      if (brand) filtered = filtered.filter(p => p.brand?.slug === brand);
      if (color) filtered = filtered.filter(p => p.variants.some((v: any) => v.color_name === color));
      if (size) filtered = filtered.filter(p => p.variants.some((v: any) => v.size_name === size));

      return NextResponse.json({ results: filtered, count: filtered.length });
    }
    
    // 2. Single Product
    if (path.startsWith('catalog/products/')) {
      const slug = segments[2];
      if (!slug) return NextResponse.json({ results: MOCK_PRODUCTS, count: MOCK_PRODUCTS.length });
      const product = MOCK_PRODUCTS.find(p => p.slug === slug) || MOCK_PRODUCTS[0];
      return NextResponse.json(product);
    }

    // 3. Categories, Brands, Colors, Sizes
    if (path === 'catalog/categories') {
      return NextResponse.json({ results: MOCK_CATEGORIES });
    }
    if (path === 'catalog/brands') {
      return NextResponse.json({ 
        results: [
          { id: 1, name: "Burhani", slug: "burhani" },
          { id: 2, name: "Premium Edition", slug: "premium-edition" },
          { id: 3, name: "Studio", slug: "studio" }
        ] 
      });
    }
    if (path === 'catalog/colors') {
      return NextResponse.json({ 
        results: [
          { id: 1, name: "Standard", hex_code: "#000000" },
          { id: 2, name: "Midnight", hex_code: "#1a1a2e" },
          { id: 3, name: "Ivory", hex_code: "#fffff0" },
          { id: 4, name: "Crimson", hex_code: "#dc143c" }
        ] 
      });
    }
    if (path === 'catalog/sizes') {
      return NextResponse.json({ 
        results: [
          { id: 1, name: "XS", sort_order: 1 },
          { id: 2, name: "S", sort_order: 2 },
          { id: 3, name: "M", sort_order: 3 },
          { id: 4, name: "L", sort_order: 4 },
          { id: 5, name: "XL", sort_order: 5 }
        ] 
      });
    }

    // 4. Carts
    if (path.startsWith('carts/')) {
      return NextResponse.json({
        id: "mock-cart-123",
        items: mockCartItems,
        total_amount: mockCartTotal.toFixed(2)
      });
    }
    
    // 5. Campaigns & Offers
    if (path.startsWith('campaigns') || path.startsWith('offers')) {
      return NextResponse.json({ results: [] });
    }

    // 6. User Profile, Addresses, Returns
    if (path.startsWith('customers/profile')) {
      return NextResponse.json({
        id: 1,
        user: { first_name: "Demo", last_name: "User", email: "demo@burhani.com" },
        phone_number: "+1234567890",
        default_shipping_address: null
      });
    }
    if (path.startsWith('customers/addresses')) {
      return NextResponse.json({
        results: [
          {
            id: 101,
            full_name: "Burhanuddin Demo",
            line1: "123 Fashion Avenue",
            line2: "Suite 4B",
            city: "Mumbai",
            state: "Maharashtra",
            postal_code: "400001",
            country: "India",
            phone: "+91 9876543210",
            is_default: true,
            address_type: "SHIPPING"
          }
        ]
      });
    }
    if (path.startsWith('customers/returns') || path.startsWith('returns/api/returns')) {
      return NextResponse.json({ 
        results: [
          {
            id: 1,
            order: "ORD-DEMO-001",
            reason: "Too large, exchanging for smaller size.",
            status: "PENDING",
            created_at: new Date().toISOString()
          }
        ] 
      });
    }

    // 7. Orders
    if (path.startsWith('orders')) {
      return NextResponse.json({ 
        results: [
          {
            id: "ORD-DEMO-001",
            status: "DELIVERED",
            total_amount: "45.00",
            created_at: new Date().toISOString(),
            items: [
              {
                id: 1,
                product_name: "Oversized Heavyweight Tee",
                quantity: 1,
                price: "45.00"
              }
            ]
          }
        ], 
        count: 1 
      });
    }

    return NextResponse.json({ message: "Mocked GET Endpoint", path }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Mock API Error" }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  if (!params || !params.path) return NextResponse.json({ success: true });
  const segments = params.path.filter(p => p.length > 0);
  const path = segments.join('/');

  // Auth / Login / Signup
  if (path === 'auth/jwt/create' || path === 'auth/users/') {
    return NextResponse.json({
      access: "mock_access_token",
      refresh: "mock_refresh_token",
      id: 1, email: "demo@burhani.com"
    });
  }

  // Carts Creation
  if (path === 'carts') {
    return NextResponse.json({ id: "mock-cart-123", items: [], total_amount: "0.00" });
  }

  // Cart Add Item
  if (path.includes('add_item')) {
    const body = await request.json().catch(() => ({}));
    const variantId = body.variant_id;
    // Find product variant
    let foundVariant = null;
    let foundProduct = null;
    for (const p of MOCK_PRODUCTS) {
      const v = p.variants.find((v: any) => v.id === variantId);
      if (v) { foundVariant = v; foundProduct = p; break; }
    }
    
    if (foundVariant && foundProduct) {
      mockCartItems.push({
        id: Math.random(),
        variant: variantId,
        variant_details: { ...foundVariant, product_name: foundProduct.name, product_image: foundProduct.media[0]?.webp_url },
        quantity: body.quantity || 1,
        price_at_addition: foundVariant.selling_price
      });
      mockCartTotal += parseFloat(foundVariant.selling_price) * (body.quantity || 1);
    }
    return NextResponse.json({ success: true });
  }
  
  // Cart Update Item
  if (path.includes('update_item')) {
      // Simplistic mock
      return NextResponse.json({ success: true });
  }
  
  // Cart Remove Item
  if (path.includes('remove_item')) {
      const body = await request.json().catch(() => ({}));
      mockCartItems = mockCartItems.filter(i => i.variant !== body.variant_id);
      return NextResponse.json({ success: true });
  }

  // Checkout / Orders
  if (path === 'orders' || path === 'orders/') {
    mockCartItems = []; // Clear cart on checkout
    mockCartTotal = 0;
    return NextResponse.json({ id: "ORD-MOCK-999", status: "processing" });
  }

  // Add Products (HQ Panel)
  if (path === 'catalog/products') {
    return NextResponse.json({ success: true, id: 999, message: "Product created" });
  }

  return NextResponse.json({ success: true, message: "Mocked POST Endpoint" });
}

export async function PUT(request: Request) {
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  return NextResponse.json({ success: true });
}
