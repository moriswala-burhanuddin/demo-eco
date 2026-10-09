"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Product, Variant } from "@/types/catalog";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/currency";

interface StickyCartBarProps {
  product: Product;
  selectedVariant: Variant | null;
}

export function StickyCartBar({ product, selectedVariant }: StickyCartBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past the main add to cart button
      // Typically around 800px down on a PDP, but we can just use scrollY
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getMediaUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  const imgUrl = product.media?.[0]?.webp_url || product.media?.[0]?.original_url || "";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border shadow-sm hidden md:flex items-center justify-between"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              {imgUrl && (
                <img 
                  src={getMediaUrl(imgUrl)} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded-md"
                />
              )}
              <div>
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(selectedVariant?.selling_price || product.variants?.[0]?.selling_price || 0)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground mr-2">
                {selectedVariant ? `${selectedVariant.color_name} / ${selectedVariant.size_name}` : "Select a size"}
              </span>
              <Button 
                onClick={() => selectedVariant && addToCart(selectedVariant.id, 1)}
                disabled={!selectedVariant}
                className="rounded-full px-8 shadow-md"
              >
                Add To Bag
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
