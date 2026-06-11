"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  size?: string;
  price: number;
  image: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  discountCode: string;
  discountAmount: number;
  open: boolean;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setDiscount: (code: string, amount: number) => void;
  setOpen: (v: boolean) => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: "",
      discountAmount: 0,
      open: false,

      addItem: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === existing.id ? { ...i, qty: i.qty + 1 } : i
              ),
              open: true,
            };
          }
          return { items: [...s.items, { ...item, qty: 1 }], open: true };
        }),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clearCart: () => set({ items: [], discountCode: "", discountAmount: 0 }),

      setDiscount: (code, amount) =>
        set({ discountCode: code, discountAmount: amount }),

      setOpen: (v) => set({ open: v }),

      getSubtotal: () =>
        get().items.reduce((s, i) => s + i.price * i.qty, 0),

      getTotal: () => {
        const sub = get().getSubtotal();
        const ship = sub >= 60 ? 0 : 4.99;
        return Math.max(0, sub + ship - get().discountAmount);
      },

      getCount: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "donstore-cart" }
  )
);
