"use client";

import { OrderRecord } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type OrderStore = {
  latestOrder: OrderRecord | null;
  setLatestOrder: (order: OrderRecord) => void;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      latestOrder: null,
      setLatestOrder: (order) => set({ latestOrder: order }),
    }),
    { name: "tfsp-latest-order" },
  ),
);