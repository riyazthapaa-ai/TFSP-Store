import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="tfsp-footer">
      <ul className="f-links">
        <li>
          <a href="/#archive">Archive</a>
        </li>
        <li>
          <Link href="/checkout">Order</Link>
        </li>
        <li>
          <a href="/#about">About</a>
        </li>
        <li>
          <a href="https://www.instagram.com/tfsp__/" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </li>
      </ul>
      <span className="f-copy">© {new Date().getFullYear()} TFSP — Nepal</span>
    </footer>
  );
}