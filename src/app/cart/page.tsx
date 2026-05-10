"use client";

import { formatNpr } from "@/lib/product-helpers";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { PageTransition } from "@/components/page-transition";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const remove = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateItemQuantity);
  const subtotal = useCartStore((state) => state.subtotal());

  return (
    <PageTransition>
      <section className="page-shell">
        <p className="s-label">— Cart</p>
        <h1 className="s-title">Your Order</h1>
        {items.length === 0 ? (
          <div className="panel">
            <p className="about-text">Your cart is empty right now.</p>
            <Link href="/shop" className="btn btn-white">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="form-grid">
            <div className="panel">
              {items.map((item) => (
                <div key={item.key} className="pb-row">
                  <div>
                    <p className="pb-name">{item.name}</p>
                    <p className="item-moq">
                      {item.size ? `Size ${item.size}` : ""} {item.color ? `· ${item.color}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button className="size-chip" type="button" onClick={() => updateQty(item.key, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button className="size-chip" type="button" onClick={() => updateQty(item.key, item.quantity + 1)}>
                      +
                    </button>
                    <button className="item-btn" type="button" onClick={() => remove(item.key)}>
                      Remove
                    </button>
                  </div>
                  <span className="pb-price">{formatNpr(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <aside className="panel">
              <div className="pb-row">
                <span className="pb-name">Subtotal</span>
                <span className="pb-price">{formatNpr(subtotal)}</span>
              </div>
              <div className="pb-row">
                <span className="pb-name">Shipping</span>
                <span className="pb-price">NPR 0</span>
              </div>
              <div className="pb-row">
                <span className="pb-name">Total</span>
                <span className="pb-price">{formatNpr(subtotal)}</span>
              </div>
              <Link href="/checkout" className="btn btn-white" style={{ marginTop: 16 }}>
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </PageTransition>
  );
}