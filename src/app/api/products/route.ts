import { readProducts, writeProducts } from "@/lib/file-db";
import { Product } from "@/types/product";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const payload = (await req.json()) as Partial<Product>;
  const products = await readProducts();

  const safeName = (payload.name || "").trim();
  const safeSlug = (payload.slug || "").trim();
  if (!safeName || !safeSlug || !payload.category) {
    return NextResponse.json({ error: "name, slug and category are required" }, { status: 400 });
  }

  const newProduct: Product = {
    id: payload.id?.trim() || `p-${Date.now()}`,
    slug: safeSlug,
    name: safeName,
    category: payload.category,
    collection: payload.collection || "TFSP",
    tagline: payload.tagline || payload.description || "",
    description: payload.description || payload.tagline || "",
    price: Number(payload.price || 0),
    oldPrice: payload.oldPrice ? Number(payload.oldPrice) : undefined,
    badge: payload.badge,
    stock: Number(payload.stock || 0),
    minQty: payload.minQty ? Number(payload.minQty) : undefined,
    sizes: payload.sizes || [],
    colors: payload.colors || [],
    imageUrl: payload.imageUrl || "",
  };

  products.push(newProduct);
  await writeProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}
