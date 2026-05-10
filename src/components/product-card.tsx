import { formatNpr } from "@/lib/product-helpers";
import { Product } from "@/types/product";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const isTee = product.category === "tees";

  return (
    <article className={isTee ? "tee-card" : "item-card"} data-hover-target="true">
      <Link href={`/product/${product.slug}`}>
        <div className={isTee ? "tee-img" : "item-img"}>
          {!isTee && <div className="item-emoji">{product.category === "stickers" ? "🎨" : "🖼️"}</div>}
          <div className={isTee ? "tee-hover-overlay" : "item-hover"}>
            <span>View Details</span>
          </div>
          {product.badge && isTee ? <span className="tee-badge">{product.badge}</span> : null}
        </div>
      </Link>
      <div className={isTee ? "tee-info" : "item-info"}>
        <h3 className={isTee ? "tee-name" : "item-name"}>{product.name}</h3>
        <p className={isTee ? "tee-collection" : "item-sub"}>{product.collection}</p>
        <p className={isTee ? "tee-tagline" : "item-sub"}>{product.tagline}</p>
        {isTee ? (
          <>
            <div className="tee-price-row">
              <span className="tee-price">{formatNpr(product.price)}</span>
              {product.oldPrice ? <span className="tee-price-old">{formatNpr(product.oldPrice)}</span> : null}
            </div>
          </>
        ) : (
          <>
            <p className="item-price">{formatNpr(product.price)}</p>
            {product.minQty ? <p className="item-moq">Min. {product.minQty} pcs</p> : null}
          </>
        )}
        <Link className={isTee ? "tee-order-btn" : "item-btn"} href={`/product/${product.slug}`}>
          View Product
        </Link>
      </div>
    </article>
  );
}