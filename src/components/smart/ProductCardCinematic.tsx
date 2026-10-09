"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/catalog";
import { EyeIcon as Eye, EyeOffIcon as EyeOff, ScanIcon as Scan, GripHorizontalIcon as GripHorizontal } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCompareStore } from "@/store/compareStore";
import { formatCurrency } from "@/lib/currency";
import { LayersIcon } from "lucide-react";

export function ProductCardCinematic({ product }: { product: Product }) {
  const { addToCart } = useCartStore();
  const { compareList, addToCompare, removeFromCompare } = useCompareStore();

  const getMediaUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `item.variant_details.product_image${url}`;
  };

  const mainImage = product.media?.[0]?.webp_url || product.media?.[0]?.original_url || "";
  const variant = product.variants?.[0];
  const isCompared = compareList.some(p => p.id === product.id);

  return (
    <div className="w-full h-full flex flex-col bg-background group">

      {/* Top: Image Area */}
      <div className={`relative flex-1 bg-secondary overflow-hidden block ${product.best_offer_badge ? 'animate-campaign-glow border border-campaign-accent/50' : ''}`}>
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {mainImage ? (
            <img
              src={getMediaUrl(mainImage)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="uppercase tracking-widest text-xs text-muted-foreground">No Image</span>
            </div>
          )}
        </Link>
        
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
          className={`absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all backdrop-blur-md ${
            isCompared 
              ? 'bg-foreground text-background border-foreground' 
              : 'bg-background/80 text-foreground border-border hover:bg-background'
          } border shadow-sm`}
        >
          <LayersIcon className="w-3.5 h-3.5" />
          {isCompared ? 'Added' : 'Compare'}
        </button>
      </div>

      {/* Bottom: Info & Actions */}
      <div className="p-5 md:p-6 flex flex-col gap-4 border-t border-border/10 relative bg-background transition-colors duration-500">
        {product.best_offer_badge && (
          <div className="absolute -top-5 right-4 bg-campaign-primary text-campaign-surface text-xs md:text-sm font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg border border-campaign-accent/30 animate-pulse">
            {product.best_offer_badge}
          </div>
        )}
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-xl md:text-2xl uppercase truncate text-foreground pr-2">{product.name}</h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1 truncate">{product.brand?.name || 'Burhani'}</p>
          </div>
          <div className="text-right shrink-0">
            {product.best_offer_price ? (
              <>
                <p className="font-black text-2xl md:text-3xl text-campaign-primary animate-pulse">{formatCurrency(product.best_offer_price)}</p>
                <p className="text-xs md:text-sm text-muted-foreground line-through">{formatCurrency(variant?.selling_price || 0)}</p>
              </>
            ) : (
              <p className="font-bold text-lg md:text-xl text-foreground">{formatCurrency(variant?.selling_price || 0)}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <button 
              className="w-full py-3 md:py-4 bg-background text-foreground border border-border hover:bg-secondary transition-colors uppercase tracking-widest text-xs font-bold cursor-pointer"
              style={{ borderRadius: 'var(--campaign-radius, 0.75rem)' }}
            >
              View Details
            </button>
          </Link>
          <button
            onClick={() => variant && addToCart(variant.id, 1)}
            className="flex-1 py-3 md:py-4 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            style={{ borderRadius: 'var(--campaign-radius, 0.75rem)' }}
          >
            <GripHorizontal className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
