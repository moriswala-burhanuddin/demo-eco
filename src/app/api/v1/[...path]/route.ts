import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';

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
