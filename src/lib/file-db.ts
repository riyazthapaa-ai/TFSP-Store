import { promises as fs } from "fs";
import path from "path";
import { Product } from "@/types/product";

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled" | "Paid";

export type StoredOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryArea: string;
  instagram: string;
  deliveryTime?: string;
  items: Array<{
    key: string;
    productId: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    paperType?: string;
    customImageDataUrl?: string;
    customImageName?: string;
  }>;
  subtotal?: number;
  shippingCost?: number;
  total: number;
  paymentMethod: "Cash on Delivery";
  paymentStatus: OrderStatus;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const productsPath = path.join(dataDir, "products.json");
const ordersPath = path.join(dataDir, "orders.json");

async function ensureFile(filePath: string, fallback = "[]") {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, fallback, "utf-8");
  }
}

export async function readProducts(): Promise<Product[]> {
  await ensureFile(productsPath);
  const raw = await fs.readFile(productsPath, "utf-8");
  return JSON.parse(raw) as Product[];
}

export async function writeProducts(products: Product[]) {
  await ensureFile(productsPath);
  await fs.writeFile(productsPath, JSON.stringify(products, null, 2), "utf-8");
}

export async function readOrders(): Promise<StoredOrder[]> {
  await ensureFile(ordersPath);
  const raw = await fs.readFile(ordersPath, "utf-8");
  return JSON.parse(raw) as StoredOrder[];
}

export async function writeOrders(orders: StoredOrder[]) {
  await ensureFile(ordersPath);
  await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), "utf-8");
}
