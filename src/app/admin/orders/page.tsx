"use client";

import { AdminGuard } from "@/components/admin-guard";
import { PageTransition } from "@/components/page-transition";
import { formatNpr } from "@/lib/product-helpers";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

type AdminOrderItem = {
  key: string;
  name: string;
  price: number;
  quantity: number;
  customImageDataUrl?: string;
  customImageName?: string;
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryArea: string;
  instagram: string;
  items: AdminOrderItem[];
  total: number;
  paymentMethod: "Cash on Delivery";
  paymentStatus: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled" | "Paid";
  createdAt: string;
};

const statuses: AdminOrder["paymentStatus"][] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as AdminOrder[];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, paymentStatus: AdminOrder["paymentStatus"]) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    await load();
  };

  return (
    <AdminGuard>
      <PageTransition>
        <section className="page-shell admin-shell">
          <div className="admin-topnav">
            <div>
              <p className="s-label">Admin</p>
              <h1 className="s-title">Orders</h1>
            </div>
            <div className="admin-nav-links">
              <Link href="/admin/products" className="btn btn-ghost">
                Products
              </Link>
              <Link href="/admin/orders" className="btn btn-ghost">
                Orders
              </Link>
              <Link href="/" className="btn btn-ghost">
                Back to Store
              </Link>
            </div>
          </div>

          <div className="panel">
            <p className="pb-cat">All Orders</p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Area</th>
                    <th>Items count</th>
                    <th>Total</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <Fragment key={o.id}>
                      <tr className="admin-row-clickable" onClick={() => setSelectedId((id) => (id === o.id ? null : o.id))}>
                        <td>{o.orderNumber}</td>
                        <td>{o.customerName}</td>
                        <td>{o.phone}</td>
                        <td>{o.deliveryArea}</td>
                        <td>{o.items.length}</td>
                        <td>{formatNpr(o.total)}</td>
                        <td>{o.paymentMethod}</td>
                        <td>
                          <span className="status-badge">{o.paymentStatus}</span>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => updateStatus(o.id, e.target.value as AdminOrder["paymentStatus"])}
                          >
                            {statuses.map((status) => (
                              <option value={status} key={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {selectedId === o.id ? (
                        <tr key={`${o.id}-details`}>
                          <td colSpan={10}>
                            <div style={{ display: "grid", gap: 8, padding: "8px 0" }}>
                              <p className="about-text" style={{ margin: 0 }}>
                                Customer: {o.customerName}
                              </p>
                              <p className="about-text" style={{ margin: 0 }}>
                                Phone: {o.phone}
                              </p>
                              <p className="about-text" style={{ margin: 0 }}>
                                Area: {o.deliveryArea}
                              </p>
                              <p className="about-text" style={{ margin: 0 }}>
                                Instagram: {o.instagram || "-"}
                              </p>
                              <p className="about-text" style={{ margin: 0 }}>
                                Payment: {o.paymentMethod}
                              </p>
                              <div style={{ display: "grid", gap: 8 }}>
                                {o.items.map((item) => (
                                  <div key={item.key} style={{ border: "1px solid var(--border)", padding: 10, borderRadius: 6 }}>
                                    <div className="pb-row">
                                      <span className="pb-name">
                                        {item.name} x {item.quantity}
                                      </span>
                                      <span className="pb-price">{formatNpr(item.price * item.quantity)}</span>
                                    </div>
                                    {item.customImageDataUrl ? (
                                      <div style={{ marginTop: 8 }}>
                                        <p className="item-moq" style={{ marginBottom: 6 }}>
                                          Custom upload: {item.customImageName || "image"}
                                        </p>
                                        <img
                                          src={item.customImageDataUrl}
                                          alt={item.customImageName || "Custom upload"}
                                          style={{ width: 180, maxWidth: "100%", border: "1px solid var(--border)", borderRadius: 6 }}
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </PageTransition>
    </AdminGuard>
  );
}