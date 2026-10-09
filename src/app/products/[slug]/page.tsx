"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product, Variant } from "@/types/catalog";
import api from "@/services/api";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { StickyCartBar } from "@/components/smart/StickyCartBar";
import { TruckIcon as Truck, RotateCcwIcon as RotateCcw, ShieldCheckIcon as ShieldCheck, RulerIcon as Ruler, MinusIcon as Minus, PlusIcon as Plus, ChevronDownIcon as ChevronDown, ChevronUpIcon as ChevronUp } from "lucide-react";
import { HorizontalScroller } from "@/components/smart/HorizontalScroller";
import { ProductCardCinematic } from "@/components/smart/ProductCardCinematic";
import { formatCurrency } from "@/lib/currency";

async function getProduct(slug: string) {
  const response = await api.get(`/catalog/products/${slug}/`);
  return response.data;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(true);
  const [showShipping, setShowShipping] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { addToCart } = useCartStore();

  const getMediaUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `item.variant_details.product_image${url}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params.slug) return;
        const data = await getProduct(params.slug as string);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        
        // Fetch related products
        let exploreMoreRes;
        if (data.category) {
          const relatedRes = await api.get(`/catalog/products/?category=${data.category}`);
          const allRelated = relatedRes.data.results || relatedRes.data;
          setRelatedProducts(allRelated.filter((p: Product) => p.id !== data.id).slice(0, 8));
          exploreMoreRes = await api.get('/catalog/products/');
        } else {
          exploreMoreRes = await api.get('/catalog/products/');
          const allRelated = exploreMoreRes.data.results || exploreMoreRes.data;
          setRelatedProducts(allRelated.filter((p: Product) => p.id !== data.id).slice(0, 8));
        }
        
        // Fetch all products for Explore More
        if (exploreMoreRes) {
            const allItems = exploreMoreRes.data.results || exploreMoreRes.data;
            // Shuffle or just slice a different part
            setAllProducts(allItems.filter((p: Product) => p.id !== data.id).sort(() => 0.5 - Math.random()).slice(0, 8));
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (params.slug) fetchProduct();
  }, [params.slug]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading product...</p>
      </div>
    </div>
  );

  const images = product.media && product.media.length > 0 
    ? product.media 
    : [];

  return (
    <>
      <StickyCartBar product={product} selectedVariant={selectedVariant} />
      
      {/* Campaign banner removed per user request */}

      <div className="min-h-screen bg-background text-foreground">
        {/* Breadcrumbs */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-4">
          <nav className="text-xs text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors cursor-pointer">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground transition-colors cursor-pointer">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Main PDP Layout */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* LEFT: Image Gallery */}
            <div className="flex flex-col gap-2">
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                {images.length > 0 ? (
                  <img 
                    src={getMediaUrl(images[activeImageIndex]?.webp_url || images[activeImageIndex]?.original_url)} 
                    alt={`${product.name} - Image ${activeImageIndex + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">No Image Available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {images.map((media, idx) => (
                    <button
                      key={media.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-24 shrink-0 overflow-hidden border-2 cursor-pointer transition-colors ${
                        activeImageIndex === idx ? 'border-foreground' : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img 
                        src={getMediaUrl(media.webp_url || media.original_url)} 
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-6 py-4">
              {/* Brand */}
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
                {product.brand?.name || 'Burhani'}
              </p>

              {/* Title */}
              <h1 className="font-heading text-4xl md:text-5xl tracking-tight leading-[1.05]">
                {product.name}
              </h1>
              
              {/* Price */}
              <div className="flex items-center gap-4">
                {product.best_offer_price ? (
                  <>
                    <p className="text-5xl md:text-6xl font-black text-campaign-primary animate-pulse tracking-tighter">
                      {formatCurrency(product.best_offer_price)}
                    </p>
                    <p className="text-xl md:text-2xl text-muted-foreground line-through font-medium mt-2">
                      {formatCurrency(selectedVariant?.selling_price || product.variants?.[0]?.selling_price || 0)}
                    </p>
                    {product.best_offer_badge && (
                      <span className="bg-campaign-primary text-campaign-surface text-sm md:text-base font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg animate-campaign-glow border border-campaign-accent/50 ml-2 mt-2">
                        {product.best_offer_badge}
                      </span>
                    )}
                  </>
                ) : (
                  <p className="text-3xl md:text-4xl font-bold">
                    {formatCurrency(selectedVariant?.selling_price || product.variants?.[0]?.selling_price || 0)}
                  </p>
                )}
              </div>

              {/* Tax info */}
              <p className="text-xs text-muted-foreground">Tax included. Shipping calculated at checkout.</p>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                {product.description || "A premium piece from our latest collection. Crafted with attention to detail and quality materials."}
              </p>
              
              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">
                    Select: <span className="text-muted-foreground font-normal">{selectedVariant?.color_name} / {selectedVariant?.size_name}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button 
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          selectedVariant?.id === variant.id 
                          ? 'bg-foreground text-background' 
                          : 'border border-border hover:border-foreground text-foreground'
                        }`}
                      >
                        {variant.size_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex gap-3 pt-2">
                <div className="flex items-center border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 hover:bg-secondary transition-colors cursor-pointer">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 text-sm font-semibold min-w-[48px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 hover:bg-secondary transition-colors cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button 
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground py-6 rounded-none font-semibold uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer"
                  onClick={() => selectedVariant && addToCart(selectedVariant.id, quantity)}
                >
                  Add to Bag
                </Button>
              </div>

              {/* Buy Now */}
              <Link href="/checkout">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full py-6 rounded-none font-semibold uppercase tracking-widest text-sm border-2 cursor-pointer mt-2"
                >
                  Buy Now
                </Button>
              </Link>

              {/* Collapsible Sections */}
              <div className="border-t border-border pt-6 space-y-0">
                {/* Product Details */}
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex justify-between items-center w-full py-4 border-b border-border cursor-pointer"
                >
                  <span className="text-sm font-semibold uppercase tracking-widest">Product Details</span>
                  {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showDetails && (
                  <div className="py-4 border-b border-border text-sm text-muted-foreground space-y-2">
                    <p>SKU: {selectedVariant?.sku || 'N/A'}</p>
                    {selectedVariant?.weight && <p>Weight: {selectedVariant.weight}</p>}
                    <p>Color: {selectedVariant?.color_name || 'N/A'}</p>
                    <p>Size: {selectedVariant?.size_name || 'N/A'}</p>
                  </div>
                )}

                {/* Shipping & Returns */}
                <button 
                  onClick={() => setShowShipping(!showShipping)}
                  className="flex justify-between items-center w-full py-4 border-b border-border cursor-pointer"
                >
                  <span className="text-sm font-semibold uppercase tracking-widest">Shipping & Returns</span>
                  {showShipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showShipping && (
                  <div className="py-4 border-b border-border text-sm text-muted-foreground space-y-3">
                    <div className="flex items-start gap-3">
                      <Truck className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Free Standard Shipping</p>
                        <p>On orders over {formatCurrency(150)}. Delivery in 5-7 business days.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Easy Returns</p>
                        <p>30-day hassle-free returns. Free return shipping.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Ruler className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Size Guide</p>
                        <p>Not sure about your size? Check our detailed size guide.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Secure Payment
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary" /> Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-32">
            <h2 className="font-heading text-4xl md:text-5xl uppercase tracking-tighter mb-12 text-center md:text-left border-t border-border pt-16">
              You May Also Like
            </h2>
            <HorizontalScroller>
              {relatedProducts.map((p, i) => (
                <div key={p.id} className={`w-[280px] md:w-[350px] flex-none overflow-hidden shadow-xl border border-border/10 ${i % 2 === 0 ? 'rounded-[2rem] md:rounded-[3rem]' : 'rounded-[2rem] md:rounded-[3rem] rounded-tr-[1rem]'}`}>
                  <ProductCardCinematic product={p} />
                </div>
              ))}
            </HorizontalScroller>
          </div>
        )}

        {/* Explore More (All Products) Section */}
        {allProducts.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-32">
            <h2 className="font-heading text-4xl md:text-5xl uppercase tracking-tighter mb-12 text-center md:text-left border-t border-border pt-16">
              Explore More
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {allProducts.map((p) => (
                <div key={p.id} className="overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border/10 rounded-2xl md:rounded-3xl">
                  <ProductCardCinematic product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
