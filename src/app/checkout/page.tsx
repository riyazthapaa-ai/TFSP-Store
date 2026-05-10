"use client";

import { PageTransition } from "@/components/page-transition";
import { formatNpr } from "@/lib/product-helpers";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";

type PaymentMethod = "Cash on Delivery";
type ShippingResult = {
  location: string;
  rateLight: number;
  rateMedium: number;
  ratePerExtraKg: number;
  deliveryTime?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const setLatestOrder = useOrderStore((state) => state.setLatestOrder);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash on Delivery");
  const [isPaying, setIsPaying] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [instagram, setInstagram] = useState("");

  const [suggestions, setSuggestions] = useState<ShippingResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<ShippingResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const shippingCost = useMemo(() => {
    const city = cityQuery.trim().toLowerCase();
    if (["kathmandu", "lalitpur", "bhaktapur"].includes(city)) return 100;
    if (selectedCity) return selectedCity.rateMedium;
    return 0;
  }, [cityQuery, selectedCity]);

  const deliveryTime = useMemo(() => {
    const city = cityQuery.trim().toLowerCase();
    if (["kathmandu", "lalitpur", "bhaktapur"].includes(city)) return "1-2 days";
    if (selectedCity) return selectedCity.deliveryTime || "2-3 days";
    return "";
  }, [cityQuery, selectedCity]);

  const total = subtotal + shippingCost;

  const isValidCity = useMemo(() => {
    const city = cityQuery.trim().toLowerCase();
    if (!city) return false;
    if (["kathmandu", "lalitpur", "bhaktapur"].includes(city)) return true;
    return !!selectedCity && selectedCity.location.toLowerCase() === city;
  }, [cityQuery, selectedCity]);

  const isPhoneValid = /^98\d{8}$/.test(phone);
  const canPay = !!fullName && isPhoneValid && !!address && isValidCity && items.length > 0 && !isPaying;

  useEffect(() => {
    const q = cityQuery.trim();
    if (q.length < 2 || selectedCity?.location === q) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/shipping?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (res.ok) {
          const data = (await res.json()) as ShippingResult[];
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch {
        // ignore
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [cityQuery, selectedCity]);

  const pickCity = (entry: ShippingResult) => {
    setSelectedCity(entry);
    setCityQuery(entry.location);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const blockNonNumericKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const applyDiscount = () => {
    setDiscountMessage(discountCode.trim() ? "Invalid code" : "");
  };

  const submitPayment = async () => {
    if (!canPay) return;
    setPaymentMethod("Cash on Delivery");

    const payload = {
      orderNumber: `TFSP-${Date.now().toString().slice(-8)}`,
      paymentMethod: "Cash on Delivery" as const,
      paymentStatus: "Pending" as const,
      items,
      subtotal,
      shippingCost,
      total,
      deliveryTime,
      delivery: {
        fullName,
        phone: `+977${phone}`,
        address,
        deliveryArea: cityQuery,
        instagram,
        deliveryTime,
      },
      createdAt: new Date().toISOString(),
    };

    setIsPaying(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const saved = res.ok ? await res.json() : payload;
    setLatestOrder({
      ...payload,
      id: saved.id,
      customerName: fullName,
      phone: `+977${phone}`,
      deliveryArea: cityQuery,
      instagram,
      subtotal,
      shippingCost,
      deliveryTime,
    });
    clearCart();
    router.push("/order-confirmation");
  };

  return (
    <PageTransition>
      <section className="page-shell">
        <p className="s-label">- Checkout</p>
        <h1 className="s-title">Shipping + Payment</h1>
        <div className="form-grid">
          <div className="panel">
            <div className="field">
              <label>Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="field">
              <label>Phone</label>
              <div className="phone-input-wrap">
                <span className="phone-prefix">+977</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phone}
                  onKeyDown={blockNonNumericKey}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="98XXXXXXXX"
                />
              </div>
              <p className="item-moq">Format: +977 98XXXXXXXX</p>
            </div>
            <div className="field">
              <label>Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Near building, shop, house name or landmark"
              />
            </div>
            <div className="field" style={{ position: "relative" }}>
              <label>City / Delivery Location</label>
              <input
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setSelectedCity(null);
                }}
                placeholder="Type city name (e.g. Kathmandu, Pokhara)"
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="city-suggestions">
                  {suggestions.map((entry) => (
                    <button key={entry.location} type="button" onClick={() => pickCity(entry)} className="city-suggestion-btn">
                      <span>{entry.location}</span>
                      <span style={{ color: "var(--text)" }}>Rs {entry.rateMedium}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="field">
              <label>Instagram Handle (optional)</label>
              <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourhandle" />
            </div>

            <div className="field">
              <label>Discount Code</label>
              <div className="discount-row">
                <input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter discount code"
                />
                <button type="button" className="btn btn-ghost" onClick={applyDiscount}>
                  Apply
                </button>
              </div>
              {discountMessage ? <p className="discount-error">{discountMessage}</p> : null}
            </div>

            <div className="payment-options">
              <button className={`pay-method ${paymentMethod === "Cash on Delivery" ? "on" : ""}`} type="button">
                Cash on Delivery
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
              <button
                className="btn btn-white"
                type="button"
                disabled={!canPay}
                onClick={submitPayment}
                style={{ opacity: canPay ? 1 : 0.5 }}
              >
                Place Order (Pay on Delivery)
              </button>
            </div>

            {isPaying && <p className="loader">Processing order...</p>}
            {total > 0 && (
              <p style={{ color: "var(--text)", fontSize: "0.85rem", marginTop: 8 }}>
                You will pay Rs {total.toLocaleString("en-NP")} to the delivery person.
              </p>
            )}
          </div>

          <aside className="panel">
            <p className="pb-cat">Order Review</p>
            {items.length === 0 && <p style={{ color: "var(--text)", fontSize: "0.85rem" }}>Your cart is empty.</p>}
            {items.map((item) => (
              <div className="pb-row" key={item.key}>
                <span className="pb-name">
                  {item.name} x {item.quantity}
                </span>
                <span className="pb-price">{formatNpr(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pb-row" style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 10 }}>
              <span className="pb-name">Subtotal</span>
              <span className="pb-price">{formatNpr(subtotal)}</span>
            </div>
            <div className="pb-row">
              <span className="pb-name">Shipping</span>
              <span className="pb-price">{shippingCost > 0 ? formatNpr(shippingCost) : "-"}</span>
            </div>
            <div className="pb-row" style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 10 }}>
              <span className="pb-name" style={{ fontWeight: "bold" }}>
                Total
              </span>
              <span className="pb-price" style={{ fontWeight: "bold" }}>
                {formatNpr(total)}
              </span>
            </div>
          </aside>
        </div>
      </section>
    </PageTransition>
  );
}