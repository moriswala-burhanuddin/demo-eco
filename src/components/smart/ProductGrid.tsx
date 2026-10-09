"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/catalog";
import { QuickLookDrawer } from "@/components/smart/QuickLookDrawer";
import { useCompareStore } from "@/store/compareStore";
import { EyeIcon as Eye, ShoppingBagIcon as ShoppingBag, LayersIcon } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface ProductGridProps {
  products: Product[];
  layout?: "grid" | "horizontal";
}

export function ProductGrid({ products, layout = "grid" }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { compareList, addToCompare, removeFromCompare } = useCompareStore();

  const getMediaUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  if (products.length === 0) {
    return null;
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const isCompared = compareList.some(p => p.id === product.id);
    return (
    <div className="group relative cursor-pointer">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3">
          {product.media && product.media.length > 0 ? (
            <img 
              src={getMediaUrl(product.media[0].webp_url || product.media[0].original_url || "")} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
            </div>
          )}
          
          {/* Quick Look Button — appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedProduct(product);
              }}
              className="w-full bg-white/95 backdrop-blur-sm text-black py-2.5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" /> Quick Look
            </button>
          </div>

          {/* "New" Badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1">
              New
            </span>
          </div>

          {/* Compare Checkbox / Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isCompared) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product);
              }
            }}
            className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 ${
              isCompared 
                ? 'bg-foreground text-background border-foreground opacity-100' 
                : 'bg-background/80 text-foreground border-border hover:bg-background'
            } border shadow-sm`}
          >
            <LayersIcon className="w-3 h-3" />
            {isCompared ? 'Added' : 'Compare'}
          </button>
        </div>
      </Link>
      
      <div className="px-0.5">
        <Link href={`/products/${product.slug}`} className="cursor-pointer">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">{product.brand?.name || 'Burhani'}</p>
          <h2 className="text-sm font-medium leading-snug mb-1 group-hover:text-primary transition-colors">{product.name}</h2>
          <p className="text-sm font-semibold">
            {formatCurrency(product.variants?.[0]?.selling_price || 0)}
          </p>
        </Link>
      </div>
    </div>
  );
  };

  if (layout === "horizontal") {
    return (
      <>
        <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory no-scrollbar -mx-2 px-2">
          {products.map((product) => (
            <div key={product.id} className="min-w-[260px] md:min-w-[280px] snap-start shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <QuickLookDrawer 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      </>
    );
  }

  // Grid layout
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <QuickLookDrawer 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </>
  );
}
