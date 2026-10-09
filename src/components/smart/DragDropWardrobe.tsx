"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBagIcon as ShoppingBag, ArrowRightIcon as ArrowRight, Trash2Icon as Trash2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";

export function DragDropWardrobe() {
  const { items, total, isOpen, setIsOpen, removeFromCart } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />
          
          {/* Wardrobe Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-[80vh] max-h-[800px] bg-background border border-border shadow-2xl z-[201] flex flex-col rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-border flex justify-between items-center bg-secondary/30">
              <h2 className="font-heading text-4xl tracking-tight flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-primary" />
                Your Wardrobe
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Close (ESC)
              </button>
            </div>

            {/* Drop Zone & Items */}
            <div className="flex-1 overflow-y-auto p-8 relative">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                  <div className="w-24 h-24 mb-4 rounded-full bg-secondary flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="font-heading text-2xl text-foreground mb-2">Drop items here</p>
                  <p className="text-sm max-w-xs">Drag and drop products from the timeline to build your wardrobe.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="group relative">
                      <div className="aspect-[3/4] bg-secondary rounded-xl overflow-hidden mb-3 border border-border relative">
                        {item.variant_details.product_image ? (
                          <img 
                            src={item.variant_details.product_image.startsWith('http') ? item.variant_details.product_image : `http://127.0.0.1:8000${item.variant_details.product_image}`} 
                            alt={item.variant_details.product_name || "Product"} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground">No Image</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="font-bold text-xs uppercase tracking-widest line-clamp-1">{item.variant_details.product_name || item.variant_details.sku}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{item.variant_details.color_name} / {item.variant_details.size_name}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.variant)}
                          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-md rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive hover:text-white cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-semibold">Qty: {item.quantity}</span>
                        <span className="text-sm font-bold">{formatCurrency(item.price_at_addition || 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-border bg-foreground text-background flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-background/60 font-semibold mb-1">Total Amount</p>
                  <p className="font-heading text-4xl tracking-tight">{formatCurrency(total)}</p>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <button className="bg-primary text-primary-foreground px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-background hover:text-foreground transition-all shadow-lg hover:shadow-xl">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
