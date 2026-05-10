"use client";

import { formatNpr } from "@/lib/product-helpers";
import { useCartStore } from "@/store/cart-store";
import { Product } from "@/types/product";
import { ChangeEvent, useMemo, useState } from "react";

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [color, setColor] = useState(product.colors?.[0] ?? "");
  const [paperType, setPaperType] = useState(product.paperTypes?.[0] ?? "");
  const [qty, setQty] = useState(product.minQty ?? 1);
  const [added, setAdded] = useState(false);
  const [customImageDataUrl, setCustomImageDataUrl] = useState("");
  const [customImageName, setCustomImageName] = useState("");

  const isTee = product.category === "tees";
  const isSticker = product.category === "stickers";
  const isCustomDesign = !!product.customDesign;
  const badgeText = useMemo(() => {
    if (product.stock <= 10) return "LOW STOCK";
    if (product.badge) return product.badge;
    return "IN STOCK";
  }, [product.badge, product.stock]);

  const displayImage = useMemo(() => {
    if (isTee && color && product.colorImages?.[color]) return product.colorImages[color];
    return product.imageUrl || "";
  }, [color, isTee, product.colorImages, product.imageUrl]);

  const onPickCustomImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setCustomImageDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const onAdd = () => {
    if (isCustomDesign && !customImageDataUrl) return;
    addItem(product, {
      size: size || undefined,
      color: color || undefined,
      paperType: paperType || undefined,
      quantity: qty,
      customImageDataUrl: customImageDataUrl || undefined,
      customImageName: customImageName || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="product-detail-grid">
      <div className="product-media">
        <div className="product-media-badge">{badgeText}</div>
        {displayImage ? (
          <img src={displayImage} alt={product.name} className="product-media-image" />
        ) : (
          <div className="product-media-mark">{product.name}</div>
        )}
      </div>
      <div className="product-meta">
        <p className="s-label">- {product.collection}</p>
        <h1 className="s-title product-title">{product.name}</h1>
        <p className="product-tagline">{product.tagline}</p>

        {isTee && (
          <div className="detail-block">
            <label>Size</label>
            <div className="chip-row">
              {product.sizes?.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`size-chip ${size === item ? "sel" : ""}`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {isTee && (
          <div className="detail-block">
            <label>Colour</label>
            <div className="chip-row">
              {product.colors?.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`color-chip ${color === item ? "on" : ""}`}
                  onClick={() => setColor(item)}
                >
                  <span className="dot" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes && product.category === "posters" && (
          <div className="detail-block">
            <label>Size</label>
            <div className="chip-row">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`size-chip ${size === item ? "sel" : ""}`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.paperTypes && product.category === "posters" && (
          <div className="detail-block">
            <label>Paper Type</label>
            <div className="chip-row">
              {product.paperTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`size-chip ${paperType === item ? "sel" : ""}`}
                  onClick={() => setPaperType(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {isCustomDesign && (
          <div className="detail-block">
            <label>Upload Your Design</label>
            <input className="custom-upload" type="file" accept="image/*" onChange={onPickCustomImage} />
            {customImageName ? <p className="item-moq">Selected: {customImageName}</p> : null}
            {customImageDataUrl ? <img src={customImageDataUrl} alt="Custom upload preview" className="custom-preview" /> : null}
          </div>
        )}

        <div className="detail-block">
          <label>Quantity</label>
          <div className="qty-row">
            <button type="button" onClick={() => setQty((v) => Math.max(product.minQty ?? 1, v - 1))}>
              -
            </button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty((v) => v + 1)}>
              +
            </button>
          </div>
          {isSticker ? <p className="item-moq">Minimum {product.minQty} pcs</p> : null}
        </div>

        <div className="tee-price-row">
          <span className="tee-price">{formatNpr(product.price)}</span>
          {product.oldPrice ? <span className="tee-price-old">{formatNpr(product.oldPrice)}</span> : null}
        </div>

        <button type="button" className="btn btn-white" onClick={onAdd} disabled={isCustomDesign && !customImageDataUrl}>
          {added ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}