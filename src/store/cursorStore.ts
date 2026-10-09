import { create } from 'zustand';

export type CursorVariant = 'default' | 'view' | 'button' | 'text' | 'magnetic';

interface CursorState {
  variant: CursorVariant;
  text: string;
  setVariant: (variant: CursorVariant, text?: string) => void;
  // Magnetic button specific state
  isMagnetic: boolean;
  magneticPosition: { x: number, y: number };
  setMagnetic: (isMagnetic: boolean, position?: { x: number, y: number }) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  variant: 'default',
  text: '',
  setVariant: (variant, text = '') => set({ variant, text }),

  isMagnetic: false,
  magneticPosition: { x: 0, y: 0 },
  setMagnetic: (isMagnetic, position = { x: 0, y: 0 }) => set({ isMagnetic, magneticPosition: position }),
}));
