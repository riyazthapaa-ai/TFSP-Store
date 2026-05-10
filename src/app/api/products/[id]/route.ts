import { readProducts, writeProducts } from "@/lib/file-db";
import { Product } from "@/types/product";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = (await req.json()) as Partial<Product>;
  const products = await readProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index < 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const next: Product = {
    ...products[index],
    ...payload,
    id: products[index].id,
    price: payload.price !== undefined ? Number(payload.price) : products[index].price,
    oldPrice: payload.oldPrice !== undefined ? Number(payload.oldPrice) : products[index].oldPrice,
    stock: payload.stock !== undefined ? Number(payload.stock) : products[index].stock,
    minQty: payload.minQty !== undefined ? Number(payload.minQty) : products[index].minQty,
  };

  products[index] = next;
  await writeProducts(products);
  return NextResponse.json(next);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await readProducts();
  const next = products.filter((p) => p.id !== id);

  if (next.length === products.length) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await writeProducts(next);
  return NextResponse.json({ success: true });
}
