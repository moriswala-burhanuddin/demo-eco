"use client";

import { useCompareStore } from "@/store/compareStore";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, LayersIcon } from "lucide-react";

export function CompareTray() {
  const { compareList, removeFromCompare, openCompareModal } = useCompareStore();

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-[var(--campaign-radius,1.5rem)] p-3 flex flex-col items-center gap-5 w-24"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="bg-foreground text-background rounded-full p-2 shadow-inner">
               <LayersIcon className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-foreground leading-tight">
              {compareList.length}/3<br/>Compare
            </span>
          </div>

          {/* Slots */}
          <div className="flex flex-col gap-2">
            {compareList.map((product) => {
              const mainImage = product.media?.[0]?.webp_url || product.media?.[0]?.original_url || "";
              const getMediaUrl = (url: string) => {
                if (!url) return "";
                if (url.startsWith('http')) return url;
                return `http://127.0.0.1:8000${url}`;
              };
              return (
                <div key={product.id} className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary border border-border/50 group shadow-sm">
                  {mainImage ? (
                    <img src={getMediaUrl(mainImage)} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-[9px] text-center p-1">No Img</div>
                  )}
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
            {Array.from({ length: 3 - compareList.length }).map((_, i) => (
              <div key={`empty-${i}`} className="w-14 h-14 rounded-xl border-2 border-dashed border-border/50 bg-secondary/30 flex items-center justify-center">
                <span className="text-muted-foreground/40 text-lg font-light">+</span>
              </div>
            ))}
          </div>
          
          {/* Action */}
          <button
            onClick={openCompareModal}
            disabled={compareList.length < 2}
            className="w-full py-2.5 bg-foreground text-background font-bold uppercase tracking-widest text-[9px] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-colors flex flex-col items-center justify-center leading-tight shadow-md"
          >
            <span>Compare</span>
            <span>Now</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
