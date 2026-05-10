"use client";

import { CartItem, Product } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, options?: { size?: string; color?: string; paperType?: string; quantity?: number; customImageDataUrl?: string; customImageName?: string }) => void;
  removeItem: (key: string) => void;
  updateItemQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, options) =>
        set((state) => {
          const size = options?.size;
          const color = options?.color;
          const paperType = options?.paperType;
          const customImageDataUrl = options?.customImageDataUrl;
          const customImageName = options?.customImageName;
          const quantityToAdd = Math.max(1, options?.quantity ?? 1);
          const key = `${product.id}-${size ?? "na"}-${color ?? "na"}-${paperType ?? "na"}-${customImageName ?? "na"}`;
          const index = state.items.findIndex((item) => item.key === key);
          if (index >= 0) {
            const next = [...state.items];
            next[index] = {
              ...next[index],
              quantity: next[index].quantity + quantityToAdd,
            };
            return { items: next };
          }

          const entry: CartItem = {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: quantityToAdd,
            size,
            color,
            paperType,
            customImageDataUrl,
            customImageName,
          };
          return { items: [...state.items, entry] };
        }),
      removeItem: (key) => set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
      updateItemQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.key === key ? { ...item, quantity: Math.max(0, quantity) } : item))
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "tfsp-cart-store" },
  ),
);