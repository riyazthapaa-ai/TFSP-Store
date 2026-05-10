import { ProductCategory } from "@/types/product";

export const PRODUCT_CATEGORIES: Array<{ key: ProductCategory; label: string }> = [
  { key: "tees", label: "Merch" },
  { key: "stickers", label: "Stickers" },
  { key: "posters", label: "Posters" },
];

export const formatNpr = (amount: number): string => `NPR ${amount.toLocaleString("en-NP")}`;