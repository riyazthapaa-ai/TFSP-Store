"use client";

import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.count());

  return (
    <nav className="tfsp-nav">
      <Link href="/" className="nav-logo">
        <Image src="/brand/star-logo.png" alt="TFSP" width={90} height={32} className="nav-logo-img" priority />
      </Link>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li>
          <a href="/#archive" className={pathname === "/" ? "active" : ""}>
            ARCHIVE
          </a>
        </li>
        <li>
          <Link href="/shop" className={pathname.startsWith("/shop") ? "active" : ""}>
            SHOP
          </Link>
        </li>
        <li>
          <Link href="/checkout" className={pathname.startsWith("/checkout") ? "active" : ""}>
            ORDER
          </Link>
        </li>
        <li>
          <a href="/#about">
            ABOUT
          </a>
        </li>
      </ul>

      <div className="nav-right">
        <Link href="/cart" className="nav-cart">
          Cart ({cartCount})
        </Link>
        <button
          className="nav-mobile-btn"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </nav>
  );
}