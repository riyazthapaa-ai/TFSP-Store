import { readOrders, writeOrders, type StoredOrder } from "@/lib/file-db";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await readOrders();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<StoredOrder> & {
    fullName?: string;
    delivery?: {
      fullName?: string;
      phone?: string;
      deliveryArea?: string;
      instagram?: string;
      deliveryTime?: string;
    };
  };

  const order: StoredOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: body.orderNumber || `TFSP-${Date.now().toString().slice(-8)}`,
    customerName: body.customerName || body.fullName || body.delivery?.fullName || "",
    phone: body.phone || body.delivery?.phone || "",
    deliveryArea: body.deliveryArea || body.delivery?.deliveryArea || "",
    instagram: body.instagram || body.delivery?.instagram || "",
    deliveryTime: body.deliveryTime || body.delivery?.deliveryTime || "",
    items: body.items || [],
    subtotal: Number(body.subtotal || 0),
    shippingCost: Number(body.shippingCost || 0),
    total: Number(body.total || 0),
    paymentMethod: "Cash on Delivery",
    paymentStatus: (body.paymentStatus as StoredOrder["paymentStatus"]) || "Pending",
    createdAt: body.createdAt || new Date().toISOString(),
  };

  const orders = await readOrders();
  orders.unshift(order);
  await writeOrders(orders);
  return NextResponse.json(order, { status: 201 });
}
