"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/catalog";
import api from "@/services/api";
import Link from "next/link";
import { SparklesIcon as Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export function DiscoveryDock() {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Fetch a mix of related/unrelated items to populate the dock
    const fetchSuggestions = async () => {
      try {
        const res = await api.get('/catalog/products/');
        const allProducts = res.data?.results || res.data || [];
        setSuggestions(Array.isArray(allProducts) ? allProducts.slice(0, 6) : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuggestions();

    // Show dock after a small delay so it doesn't interrupt initial load
    setTimeout(() => setIsVisible(true), 1500);
  }, []);

  const getMediaUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `item.variant_details.product_image${url}`;
  };

  return (
    <AnimatePresence>
      {isVisible && suggestions.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-border/50 p-2 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300">

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="pl-4 pr-4 py-1 flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity min-w-[70px]"
            >
              <Sparkles className={`w-5 h-5 text-primary mb-1 transition-transform duration-300 ${isExpanded ? 'rotate-12' : ''}`} />
              <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                {isExpanded ? 'Close' : 'Discover'}
              </span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex gap-2 overflow-x-auto no-scrollbar max-w-[70vw] md:max-w-2xl origin-left pr-2"
                >
                  {suggestions.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="w-16 h-20 md:w-20 md:h-24 bg-secondary rounded-xl overflow-hidden relative cursor-pointer group shadow-sm border border-border/20"
                      >
                        {product.media && product.media.length > 0 ? (
                          <img
                            src={getMediaUrl(product.media[0].thumbnail_url || product.media[0].original_url)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary text-[8px] uppercase">
                            No Img
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold tracking-wider">{formatCurrency(product.variants?.[0]?.selling_price || 0)}</span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
