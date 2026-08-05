"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  nameEn: string;
  nameAm: string;
  priceETB: number;
  priceUSD: number;
  quantity: number;
  imageUrl: string | null;
};

export type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY" | null;

type CartStore = {
  items: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalETB: () => number;
  totalUSD: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: null,
      setOrderType: (type) => set({ orderType: type }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [], orderType: null }),
      totalETB: () => get().items.reduce((sum, i) => sum + i.priceETB * i.quantity, 0),
      totalUSD: () => get().items.reduce((sum, i) => sum + i.priceUSD * i.quantity, 0),
    }),
    { name: "nyc-cart" }
  )
);