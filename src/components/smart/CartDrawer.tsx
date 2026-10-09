"use client";

import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { XIcon as X, Trash2Icon as Trash2, ShoppingBagIcon as ShoppingBag, PlusIcon, MinusIcon } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";

export function CartDrawer() {
  const { items, total, isOpen, setIsOpen, removeFromCart, updateCartItemQuantity } = useCartStore();

  const FREE_SHIPPING_THRESHOLD = 150;
  const amountAway = FREE_SHIPPING_THRESHOLD - total;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* We don't render the trigger here, we'll control open state from Header */}
      <SheetContent className="w-full sm:max-w-md border-l-0 flex flex-col p-0 z-[200]">
        <SheetHeader className="p-8 border-b border-border bg-background">
          <SheetTitle className="font-heading text-4xl md:text-5xl uppercase tracking-tighter flex items-center justify-between">
            Your Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {/* Free Shipping Progress */}
        <div className="bg-secondary p-4 text-center uppercase tracking-widest text-[10px] font-semibold border-b border-border">
          {amountAway > 0 ? (
            <p>You're <span className="text-primary font-bold">{formatCurrency(amountAway)}</span> away from Free Shipping.</p>
          ) : (
            <p className="text-primary font-bold">You qualify for Free Shipping.</p>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="uppercase tracking-widest text-xs font-semibold">Your bag is empty</p>
              <Button variant="outline" className="rounded-none mt-4 uppercase tracking-widest text-xs" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <Link href={`/products/${item.variant_details?.product_slug || ''}`} onClick={() => setIsOpen(false)} className="block w-24 h-32 bg-secondary border flex items-center justify-center overflow-hidden relative group">
                     {item.variant_details?.product_image ? (
                        <img 
                          src={item.variant_details.product_image.startsWith('http') ? item.variant_details.product_image : `http://127.0.0.1:8000${item.variant_details.product_image}`}
                          alt={item.variant_details?.product_name || "Product image"} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                     ) : (
                        <span className="text-xs text-muted-foreground uppercase tracking-widest text-[10px]">No Img</span>
                     )}
                  </Link>
                  
                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link href={`/products/${item.variant_details?.product_slug || ''}`} onClick={() => setIsOpen(false)} className="font-semibold uppercase tracking-widest text-xs md:text-sm hover:text-primary transition-colors pr-2">
                            {item.variant_details?.product_name || 'Item'}
                        </Link>
                        <button onClick={() => removeFromCart(item.variant_details?.id || item.variant)} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Size: {item.variant_details?.size_name || 'N/A'}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Color: {item.variant_details?.color_name || 'N/A'}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-border h-8">
                        <button 
                            className="px-2 h-full flex items-center justify-center hover:bg-secondary transition-colors"
                            onClick={() => updateCartItemQuantity(item.variant_details?.id || item.variant, item.quantity - 1)}
                        >
                            <MinusIcon size={12} />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button 
                            className="px-2 h-full flex items-center justify-center hover:bg-secondary transition-colors"
                            onClick={() => updateCartItemQuantity(item.variant_details?.id || item.variant, item.quantity + 1)}
                        >
                            <PlusIcon size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.price_at_addition || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 border-t border-border bg-background space-y-6">
            <div className="flex justify-between font-heading text-4xl">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground text-center">Taxes and shipping calculated at checkout.</p>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="block w-full">
              <Button className="w-full bg-primary text-primary-foreground py-6 rounded-none text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-300">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
