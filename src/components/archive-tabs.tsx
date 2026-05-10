"use client";

import { PRODUCT_CATEGORIES } from "@/lib/product-helpers";
import { Product } from "@/types/product";
import { ProductCategory } from "@/types/product";
import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";

export function ArchiveTabs({ fullGrid = false, products }: { fullGrid?: boolean; products: Product[] }) {
  const [active, setActive] = useState<ProductCategory>("tees");
  const list = useMemo(() => products.filter((item) => item.category === active), [active, products]);

  return (
    <>
      <div className="category-cards">
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            className={`category-card ${active === category.key ? "active" : ""}`}
            key={category.key}
            type="button"
            onClick={() => setActive(category.key)}
          >
            {category.key === "tees" ? "MERCH" : category.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={active === "tees" ? "tee-grid" : "item-grid"}>
        {(fullGrid ? list : list.slice(0, 4)).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
