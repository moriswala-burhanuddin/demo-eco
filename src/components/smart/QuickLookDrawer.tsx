"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon as X } from "lucide-react";
import { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/currency";

interface QuickLookDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickLookDrawer({ product, isOpen, onClose }: QuickLookDrawerProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const { addToCart } = useCartStore();

  const getMediaUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  const handleAddToCart = () => {
    const variantId = selectedVariantId || (product?.variants?.[0]?.id);
    if (variantId) {
      addToCart(variantId, 1);
      onClose(); // Close drawer after adding
    }
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[9999] w-full md:w-[500px] bg-background border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">Quick Look</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              <div className="aspect-[3/4] bg-secondary rounded-xl overflow-hidden mb-8 relative">
                {product.media && product.media.length > 0 ? (
                  <img 
                    src={getMediaUrl(product.media[0].webp_url || product.media[0].original_url)}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                    No Image
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                  {product.brand?.name || 'Burhani'}
                </p>
                <h1 className="font-heading text-3xl mb-2">{product.name}</h1>
                <p className="text-xl font-medium text-primary">
                  {formatCurrency(product.variants?.[0]?.selling_price || 0)}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants?.map((variant) => {
                    const isSelected = selectedVariantId ? selectedVariantId === variant.id : product.variants?.[0]?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`px-4 py-2 border rounded-full text-xs font-semibold transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-border hover:border-primary text-foreground'
                        }`}
                      >
                        {variant.size_name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-background">
              <Button 
                onClick={handleAddToCart}
                size="lg" 
                className="w-full h-14 rounded-full text-sm uppercase tracking-widest font-semibold shadow-xl"
              >
                Add To Bag
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
