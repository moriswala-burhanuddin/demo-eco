"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, total, fetchCart, removeFromCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Your cart is currently empty.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{item.variant_details?.sku || `Variant ${item.variant}`}</span>
                  <span className="text-sm text-gray-500">
                    Size: {item.variant_details?.size_name || 'N/A'} | Color: {item.variant_details?.color_name || 'N/A'}
                  </span>
                  <span className="text-sm">Qty: {item.quantity}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">${parseFloat(item.price_at_addition || '0').toFixed(2)}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.variant_details?.id || item.variant)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-end">
            <div className="flex justify-between w-full md:w-64 mb-4">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-bold text-xl">${total}</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Taxes and shipping calculated at checkout.</p>
            <Link href="/checkout">
              <Button size="lg" className="w-full md:w-auto">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
