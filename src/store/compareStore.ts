import { create } from 'zustand';
import { Product } from '@/types/catalog';

interface CompareStore {
  compareList: Product[];
  isCompareModalOpen: boolean;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  compareList: [],
  isCompareModalOpen: false,
  
  addToCompare: (product) => {
    const { compareList } = get();
    // Don't add if already in list
    if (compareList.some(p => p.id === product.id)) return;
    
    // Max 3 items
    if (compareList.length >= 3) {
      // Replace the last item
      set({ compareList: [...compareList.slice(0, 2), product] });
    } else {
      set({ compareList: [...compareList, product] });
    }
  },
  
  removeFromCompare: (productId) => set((state) => ({
    compareList: state.compareList.filter(p => p.id !== productId)
  })),
  
  clearCompare: () => set({ compareList: [] }),
  
  openCompareModal: () => set({ isCompareModalOpen: true }),
  closeCompareModal: () => set({ isCompareModalOpen: false }),
}));
