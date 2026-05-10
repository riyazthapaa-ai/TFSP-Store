import { readOrders, writeOrders, type StoredOrder } from "@/lib/file-db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as Partial<StoredOrder>;
  const orders = await readOrders();
  const index = orders.findIndex((o) => o.id === id);

  if (index < 0) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const next: StoredOrder = {
    ...orders[index],
    ...body,
    id: orders[index].id,
    orderNumber: orders[index].orderNumber,
  };

  orders[index] = next;
  await writeOrders(orders);
  return NextResponse.json(next);
}
