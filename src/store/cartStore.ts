import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';
import { Variant } from '@/types/catalog';

interface CartItem {
  id: number;
  variant: number; // The variant ID
  variant_details: Variant & { product_name?: string; product_slug?: string; product_image?: string };
  quantity: number;
  price_at_addition: string;
}

interface CartState {
  cartId: number | null;
  items: CartItem[];
  total: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchCart: () => Promise<void>;
  addToCart: (variantId: number, quantity: number) => Promise<void>;
  updateCartItemQuantity: (variantId: number, quantity: number) => Promise<void>;
  removeFromCart: (variantId: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      total: 0,
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
  
  fetchCart: async () => {
    try {
      const currentCartId = get().cartId;
      if (!currentCartId) return;

      const response = await api.get(`/carts/${currentCartId}/`);
      const cart = response.data;
      if (cart) {
        set({ cartId: cart.id, items: cart.items || [], total: parseFloat(cart.total_amount) || 0 });
      }
    } catch (error: any) {
      console.error('Failed to fetch cart', error);
      if (error.response?.status === 404) {
        set({ cartId: null, items: [], total: 0 });
      }
    }
  },

  addToCart: async (variantId, quantity) => {
    try {
      let currentCartId = get().cartId;
      
      // Create cart if one doesn't exist
      if (!currentCartId) {
        const cartResponse = await api.post('/carts/', {});
        currentCartId = cartResponse.data.id;
        set({ cartId: currentCartId });
      }

      await api.post(`/carts/${currentCartId}/add_item/`, {
        variant_id: variantId,
        quantity: quantity
      });
      await get().fetchCart();
      set({ isOpen: true });
    } catch (error: any) {
      console.error('Failed to add to cart', error);
      alert(error.response?.data?.error || 'Failed to add item to cart. It might be out of stock.');
    }
  },

  updateCartItemQuantity: async (variantId, quantity) => {
    try {
      const currentCartId = get().cartId;
      if (!currentCartId) return;

      await api.post(`/carts/${currentCartId}/update_item/`, {
        variant_id: variantId,
        quantity: quantity
      });
      await get().fetchCart();
    } catch (error: any) {
      console.error('Failed to update cart quantity', error);
      alert(error.response?.data?.error || 'Failed to update quantity. It might be out of stock.');
    }
  },

  removeFromCart: async (variantId) => {
    try {
      const currentCartId = get().cartId;
      if (!currentCartId) return;

      await api.post(`/carts/${currentCartId}/remove_item/`, {
        variant_id: variantId
      });
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  },

      clearCart: () => {
        set({ items: [], total: 0, cartId: null });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
);
