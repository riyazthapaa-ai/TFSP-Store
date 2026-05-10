"use client";

import { PageTransition } from "@/components/page-transition";
import { formatNpr } from "@/lib/product-helpers";
import { useOrderStore } from "@/store/order-store";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const latestOrder = useOrderStore((state) => state.latestOrder);

  return (
    <PageTransition>
      <section className="page-shell">
        <p className="s-label">— Confirmation</p>
        <h1 className="s-title">Order Confirmed</h1>
        {!latestOrder ? (
          <div className="panel">
            <p className="about-text">No recent order found. Complete checkout first.</p>
            <Link href="/shop" className="btn btn-white">
              Back to Shop
            </Link>
          </div>
        ) : (
          <div className="form-grid">
            <article className="panel">
              <p className="pb-cat">Order Number</p>
              <p className="pb-title" style={{ fontSize: "1.6rem" }}>
                {latestOrder.orderNumber}
              </p>
              <div className="pb-row">
                <span className="pb-name">Payment Status</span>
                <span className="pb-price">{latestOrder.paymentStatus}</span>
              </div>
              <div className="pb-row">
                <span className="pb-name">Method</span>
                <span className="pb-price">{latestOrder.paymentMethod}</span>
              </div>
              <div className="pb-row">
                <span className="pb-name">Delivery Area</span>
                <span className="pb-price">{latestOrder.delivery.deliveryArea}</span>
              </div>
              <div className="pb-row">
                <span className="pb-name">Delivery Estimate</span>
                <span className="pb-price">{latestOrder.deliveryTime || "TBD"}</span>
              </div>
            </article>
            <article className="panel">
              <p className="pb-cat">Items Ordered</p>
              {latestOrder.items.map((item) => (
                <div className="pb-row" key={item.key}>
                  <span className="pb-name">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="pb-price">{formatNpr(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="pb-row">
                <span className="pb-name">Subtotal</span>
                <span className="pb-price">{formatNpr(latestOrder.subtotal || latestOrder.total)}</span>
              </div>
              <div className="pb-row">
                <span className="pb-name">Shipping ({latestOrder.delivery.deliveryArea})</span>
                <span className="pb-price">{formatNpr(latestOrder.shippingCost || 0)}</span>
              </div>
              <div className="pb-row">
                <span className="pb-name">
                  {latestOrder.paymentMethod === "Cash on Delivery" ? "Total to Pay" : "Total Paid"}
                </span>
                <span className="pb-price">{formatNpr(latestOrder.total)}</span>
              </div>
              {latestOrder.paymentMethod === "Cash on Delivery" ? (
                <p className="about-text">Pay Rs {latestOrder.total.toLocaleString("en-NP")} on delivery</p>
              ) : null}
              <Link href="/shop" className="btn btn-white" style={{ marginTop: 14 }}>
                Continue Shopping
              </Link>
            </article>
          </div>
        )}
      </section>
    </PageTransition>
  );
}