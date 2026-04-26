import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartItemId: string; // product-color
  product: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  colorName?: string;
  colorHex?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const cartItemId = `${item.product}-${item.color || 'default'}`;
        const existing = state.items.find((i) => i.cartItemId === cartItemId);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, cartItemId }] };
      }),
      removeItem: (cartItemId) => set((state) => ({
        items: state.items.filter((i) => i.cartItemId !== cartItemId),
      })),
      updateQuantity: (cartItemId, quantity) => set((state) => ({
        items: state.items.map((i) => i.cartItemId === cartItemId ? { ...i, quantity } : i),
      })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'ecommerce-cart',
    }
  )
);
