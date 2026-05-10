import { Product, ProductCategory } from "@/types/product";
import { readProducts } from "./file-db";

export const PRODUCT_CATEGORIES: Array<{ key: ProductCategory; label: string }> = [
  { key: "tees", label: "Tee Collection" },
  { key: "stickers", label: "Stickers" },
  { key: "posters", label: "Posters" },
];

export const formatNpr = (amount: number): string => `NPR ${amount.toLocaleString("en-NP")}`;

export async function fetchProducts(): Promise<Product[]> {
  return readProducts();
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((item) => item.slug === slug);
}
