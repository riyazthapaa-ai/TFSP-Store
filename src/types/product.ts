export type ProductCategory = "tees" | "stickers" | "posters";
export type ProductBadge = "NEW" | "LIMITED";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collection: string;
  tagline: string;
  description?: string;
  price: number;
  oldPrice?: number;
  badge?: ProductBadge;
  stock: number;
  minQty?: number;
  sizes?: string[];
  colors?: string[];
  paperTypes?: string[];
  imageUrl?: string;
  colorImages?: Record<string, string>;
  customDesign?: boolean;
}

export interface CartItem {
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
}

export interface CheckoutInfo {
  fullName: string;
  phone: string;
  deliveryArea: string;
  instagram: string;
  deliveryTime?: string;
}

export interface OrderRecord {
  id?: string;
  orderNumber: string;
  customerName?: string;
  phone?: string;
  deliveryArea?: string;
  instagram?: string;
  subtotal: number;
  shippingCost: number;
  deliveryTime: string;
  paymentMethod: "Cash on Delivery";
  paymentStatus: "Paid" | "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  items: CartItem[];
  total: number;
  delivery: CheckoutInfo;
  createdAt: string;
}