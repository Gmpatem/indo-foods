import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (menuItemId: string) => number;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

const TAX_RATE = 0.10; // 10% tax

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: MenuItem) => {
        const items = get().items;
        const existingItem = items.find(i => i.menuItemId === item.id);

        if (existingItem) {
          set({
            items: items.map(i =>
              i.menuItemId === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeItem: (menuItemId: string) => {
        const items = get().items;
        const existingItem = items.find(i => i.menuItemId === menuItemId);

        if (existingItem && existingItem.quantity > 1) {
          set({
            items: items.map(i =>
              i.menuItemId === menuItemId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          });
        } else {
          set({
            items: items.filter(i => i.menuItemId !== menuItemId),
          });
        }
      },

      updateQuantity: (menuItemId: string, quantity: number) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter(i => i.menuItemId !== menuItemId),
          });
        } else {
          set({
            items: get().items.map(i =>
              i.menuItemId === menuItemId ? { ...i, quantity } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getItemQuantity: (menuItemId: string) => {
        const item = get().items.find(i => i.menuItemId === menuItemId);
        return item ? item.quantity : 0;
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTax: () => {
        return get().getSubtotal() * TAX_RATE;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },
    }),
    {
      name: 'indo-foods-cart',
    }
  )
);
