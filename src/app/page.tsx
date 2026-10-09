import Link from "next/link";
import { Product, Category } from "@/types/catalog";
import { HorizontalScroller } from "@/components/smart/HorizontalScroller";
import { ArrowRightIcon as ArrowRight, ShoppingBagIcon as ShoppingBag, PlusIcon, Leaf, Recycle, Droplets } from "lucide-react";
import { ProductCardCinematic } from "@/components/smart/ProductCardCinematic";
import { DynamicBanner } from "@/components/smart/DynamicBanner";

const getMediaUrl = (url: string | null) => {
  if (!url) return "";
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}${url}`;
};

async function getFeaturedProducts(): Promise<Product[]> {
  return [
    {
      id: 1,
      name: "Oversized Heavyweight Tee",
      slug: "oversized-heavyweight-tee",
      description: "Premium cotton tee.",
      category: { id: 1, name: "Streetwear", slug: "streetwear", description: "", parent: null },
      brand: { id: 1, name: "Burhani", slug: "burhani" },
      is_active: true,
      rating: 4.8,
      material: "100% Cotton",
      delivery_days: 3,
      warranty_years: 1,
      variants: [
        { id: 1, product: 1, sku: "TEE-01", upc: "", color_name: "Black", size: 1, size_name: "L", selling_price: "45.00", weight: "0.2", is_active: true }
      ],
      media: [
        { id: 1, media_file: { id: "1", file: "", file_type: "image", webp_version: "", thumbnail: "", alt_text: "" }, is_primary: true, order: 1, webp_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", thumbnail_url: null, original_url: null }
      ]
    },
    {
      id: 2,
      name: "Essential Silk Kurti",
      slug: "essential-silk-kurti",
      description: "Premium silk.",
      category: { id: 2, name: "Essentials", slug: "essentials", description: "", parent: null },
      brand: { id: 1, name: "Burhani", slug: "burhani" },
      is_active: true,
      rating: 4.9,
      material: "Silk",
      delivery_days: 3,
      warranty_years: 1,
      variants: [
        { id: 2, product: 2, sku: "KUR-01", upc: "", color_name: "White", size: 1, size_name: "M", selling_price: "120.00", weight: "0.3", is_active: true }
      ],
      media: [
        { id: 2, media_file: { id: "2", file: "", file_type: "image", webp_version: "", thumbnail: "", alt_text: "" }, is_primary: true, order: 1, webp_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", thumbnail_url: null, original_url: null }
      ]
    },
    {
      id: 3,
      name: "Tailored Wide-Leg Trousers",
      slug: "tailored-wide-leg-trousers",
      description: "Elegant trousers.",
      category: { id: 2, name: "Essentials", slug: "essentials", description: "", parent: null },
      brand: { id: 1, name: "Burhani", slug: "burhani" },
      is_active: true,
      rating: 4.7,
      material: "Linen",
      delivery_days: 3,
      warranty_years: 1,
      variants: [
        { id: 3, product: 3, sku: "TRO-01", upc: "", color_name: "Beige", size: 1, size_name: "32", selling_price: "85.00", weight: "0.4", is_active: true }
      ],
      media: [
        { id: 3, media_file: { id: "3", file: "", file_type: "image", webp_version: "", thumbnail: "", alt_text: "" }, is_primary: true, order: 1, webp_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop", thumbnail_url: null, original_url: null }
      ]
    },
    {
      id: 4,
      name: "Heavyweight Hoodie",
      slug: "heavyweight-hoodie",
      description: "Warm hoodie.",
      category: { id: 1, name: "Streetwear", slug: "streetwear", description: "", parent: null },
      brand: { id: 1, name: "Burhani", slug: "burhani" },
      is_active: true,
      rating: 4.9,
      material: "Cotton Blend",
      delivery_days: 3,
      warranty_years: 1,
      variants: [
        { id: 4, product: 4, sku: "HOO-01", upc: "", color_name: "Grey", size: 1, size_name: "XL", selling_price: "95.00", weight: "0.6", is_active: true }
      ],
      media: [
        { id: 4, media_file: { id: "4", file: "", file_type: "image", webp_version: "", thumbnail: "", alt_text: "" }, is_primary: true, order: 1, webp_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop", thumbnail_url: null, original_url: null }
      ]
    }
  ];
}

async function getCategories(): Promise<Category[]> {
  return [
    { id: 1, name: 'Streetwear', slug: 'streetwear', description: '', parent: null },
    { id: 2, name: 'Essentials', slug: 'essentials', description: '', parent: null },
    { id: 3, name: 'Accessories', slug: 'accessories', description: '', parent: null }
  ];
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  const heroProduct1 = featuredProducts[0];
  const heroProduct2 = featuredProducts[1] || featuredProducts[0];

  const heroImage1 = getMediaUrl(heroProduct1?.media?.[0]?.webp_url || heroProduct1?.media?.[0]?.original_url || null);
  const heroImage2 = getMediaUrl(heroProduct2?.media?.[0]?.webp_url || heroProduct2?.media?.[0]?.original_url || null);

  const displayCategories = categories.length >= 3 ? categories : [
    { id: 1, name: 'Streetwear', slug: 'streetwear', description: '', parent: null },
    { id: 2, name: 'Essentials', slug: 'essentials', description: '', parent: null },
    { id: 3, name: 'Accessories', slug: 'accessories', description: '', parent: null }
  ];

  return (
    <main className="bg-background text-foreground pb-32 transition-colors duration-500 font-sans">
      
      {/* ===== BENTO HERO SECTION ===== */}
      <section className="bg-black px-3 pb-3 w-full flex flex-col mb-10">
        <div className="relative w-full max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_auto_auto] md:grid-rows-3 gap-3 md:gap-4 flex-1 md:h-[85vh] md:min-h-[700px]">
          
          {/* Top Left: 2 cols, 2 rows */}
          <div className="md:col-span-2 md:row-span-2 bg-[#F4F4F0] rounded-[1.5rem] md:rounded-[2rem] relative flex flex-col justify-between overflow-hidden group min-h-[60vh] md:min-h-0">
            
            <div className="absolute inset-0 z-0 bg-[#e5e5e5]">
              <img src={heroImage1 || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"} alt="Hero Fashion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

            <div className="relative z-20 w-3/4 p-8 md:p-10 mix-blend-difference text-white">
              <h1 className="text-5xl md:text-[7rem] font-black leading-[0.85] tracking-tighter uppercase drop-shadow-lg">
                BURHANI<br/>STUDIOS
              </h1>
            </div>
            
            <div className="relative z-20 self-end text-right p-8 md:p-10 mt-20 md:mt-0 mix-blend-difference text-white">
              <h2 className="text-4xl md:text-[5rem] font-black leading-[0.85] tracking-tighter uppercase drop-shadow-lg">
                NEW<br/>SEASON
              </h2>
            </div>
          </div>

          {/* Right: 1 col, 3 rows */}
          <div className="hidden md:flex md:col-span-1 md:row-span-3 bg-[#F4F4F0] rounded-[1.5rem] md:rounded-[2rem] p-4 relative items-center justify-center overflow-hidden group">
            <img src={heroImage2 || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"} alt="Fashion look" className="w-full h-full rounded-[1rem] object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Bottom Left: 1 col, 1 row */}
          <div className="md:col-span-1 md:row-span-1 bg-[#F4F4F0] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative min-h-[200px] md:min-h-0">
            <div>
              <h2 className="text-5xl md:text-[4rem] font-black leading-[0.8] tracking-tighter text-black mb-2">20% OFF</h2>
              <p className="font-bold text-black/80 text-sm md:text-base leading-tight uppercase">
                on all the products<br/>shop it now
              </p>
            </div>
            
            <Link href="/products" className="self-start md:self-end mt-4 flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-black/10 hover:bg-black hover:text-white transition-colors group">
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-bold uppercase tracking-wider text-black/50 group-hover:text-white/60">Shop</span>
                <span className="text-xs font-black uppercase tracking-wider text-black group-hover:text-white">All Products</span>
              </div>
              <ShoppingBag className="w-5 h-5 text-black group-hover:text-white" />
            </Link>
          </div>

          {/* Bottom Middle: 1 col, 1 row */}
          <div className="md:col-span-1 md:row-span-1 bg-[#111111] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative group cursor-pointer min-h-[300px] md:min-h-0 hidden md:block">
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop" alt="Clothes" className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
              <p className="text-white text-center font-black uppercase tracking-[0.2em] text-xs md:text-sm">Check out the new stuff</p>
            </div>
          </div>

          {/* Absolute position cutouts */}
          <div className="hidden md:flex absolute top-[66.66%] left-[66.66%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#F4F4F0] rounded-full border-[12px] md:border-[16px] border-black items-center justify-center z-20 hover:rotate-90 transition-transform duration-500 cursor-pointer">
            <PlusIcon className="w-6 h-6 text-black stroke-[3]" />
          </div>

          <div className="hidden md:flex absolute top-[66.66%] left-0 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] bg-[#F4F4F0] rounded-full border-[12px] md:border-[16px] border-black items-center justify-center z-20 group cursor-pointer hover:scale-110 transition-transform duration-300">
            <ArrowRight className="w-5 h-5 text-black stroke-[3] group-hover:translate-x-1 transition-transform" />
          </div>

        </div>
      </section>

      {/* Campaign Banner */}
      <DynamicBanner placement="HOME_HERO" />

      {/* Static Marquee */}
      <div className="w-full bg-primary text-primary-foreground py-4 overflow-hidden whitespace-nowrap flex mt-12 mb-8">
        <div className="animate-marquee flex shrink-0 gap-8 font-heading text-lg md:text-2xl tracking-[0.1em] uppercase font-bold px-8">
            {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="flex items-center gap-8">
                    NEW ARRIVALS <span className="text-primary-foreground/50">•</span> PREMIUM QUALITY <span className="text-primary-foreground/50">•</span> ETHICAL FASHION <span className="text-primary-foreground/50">•</span>
                </span>
            ))}
        </div>
        <div className="animate-marquee flex shrink-0 gap-8 font-heading text-lg md:text-2xl tracking-[0.1em] uppercase font-bold px-8" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="flex items-center gap-8">
                    NEW ARRIVALS <span className="text-primary-foreground/50">•</span> PREMIUM QUALITY <span className="text-primary-foreground/50">•</span> ETHICAL FASHION <span className="text-primary-foreground/50">•</span>
                </span>
            ))}
        </div>
      </div>

      {/* 3. Horizontal Scroller (Pinned Gallery) with Cinematic Cards */}
      <section className="mb-16">
        <div className="px-4 md:px-12 mb-6 flex justify-between items-end">
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight text-primary">New Arrivals</h2>
          <p className="uppercase tracking-widest text-xs font-bold text-primary hidden md:block">Scroll to explore</p>
        </div>

        <HorizontalScroller>
          {featuredProducts.map((product) => (
            <div key={product.id} className="w-[85vw] md:w-[45vw] lg:w-[30vw] h-[65vh] shrink-0 flex items-center justify-center p-2 md:p-4 snap-center">
              <div className="w-full h-full rounded-[1.5rem] border border-border overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <ProductCardCinematic product={product} />
              </div>
            </div>
          ))}
        </HorizontalScroller>
      </section>

      {/* 4. Elegant Collections Grid */}
      <section className="px-4 md:px-12 py-16 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl tracking-tight text-foreground mb-3">Shop by Vibe.</h2>
            <p className="text-muted-foreground max-w-xl text-sm md:text-base">Curated collections for your modern wardrobe. Every piece is crafted with style and sustainability in mind.</p>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors border-b border-foreground pb-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[800px] md:h-[500px]">
          {displayCategories.map((cat, index) => {
            const bgs = [
              "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop"
            ];
            
            // First category spans 2 cols on desktop for a dynamic look
            const isFirst = index === 0;

            return (
              <Link 
                key={cat.slug} 
                href={`/products?category=${cat.slug}`} 
                className={`group relative rounded-[2rem] overflow-hidden bg-muted ${isFirst ? 'md:col-span-2' : ''}`}
              >
                <img src={bgs[index % 3]} alt={cat.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-10">
                  <h3 className="text-white font-heading text-3xl md:text-4xl mb-2">{cat.name}</h3>
                  <div className="flex items-center text-white/80 font-medium text-sm gap-2">
                    Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 5. Features Section */}
      <section className="py-24 px-4 md:px-12 bg-secondary text-secondary-foreground mb-16 overflow-hidden relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-6xl tracking-tight mb-12">
            Crafted for <span className="text-primary">confidence.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 text-left">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-foreground shadow-sm">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-wide">Premium Fabrics</h3>
              <p className="text-secondary-foreground/70 leading-relaxed text-sm">We source only the highest quality materials for our garments to ensure longevity and comfort.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-foreground shadow-sm">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-wide">Ethical Fashion</h3>
              <p className="text-secondary-foreground/70 leading-relaxed text-sm">Sustainably made in fair-trade certified facilities to ensure fair wages and safe working conditions.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-6 text-foreground shadow-sm">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-wide">Perfect Fit</h3>
              <p className="text-secondary-foreground/70 leading-relaxed text-sm">Designed and tailored to fit flawlessly on every body type, empowering you every day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer Hook Section */}
      <section className="px-4 md:px-8">
        <div className="bg-primary text-primary-foreground rounded-[2rem] md:rounded-[4rem] p-12 md:p-24 text-center flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop" alt="Fashion texture" className="w-full h-full object-cover opacity-10 mix-blend-overlay group-hover:scale-105 transition-transform duration-[2s]" />
          </div>
          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-6xl tracking-tight mb-6">
              Join the Movement.
            </h2>
            <p className="text-xs md:text-sm uppercase tracking-widest font-semibold max-w-md mx-auto mb-10 opacity-90">
              Subscribe to get early access to new collections, exclusive drops, and styling tips.
            </p>
            <div className="flex w-full max-w-md border-b border-primary-foreground/50 pb-2 transition-colors mx-auto group-focus-within:border-primary-foreground">
              <input type="email" placeholder="ENTER YOUR EMAIL" className="bg-transparent border-none outline-none text-xs uppercase tracking-widest font-bold flex-1 placeholder:text-primary-foreground/60 text-primary-foreground" />
              <button className="text-xs uppercase tracking-widest font-bold hover:opacity-70 transition-opacity">Submit</button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
