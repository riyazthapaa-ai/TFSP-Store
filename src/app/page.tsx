import { ArchiveTabs } from "@/components/archive-tabs";
import { HeroVideo } from "@/components/hero-video";
import { MarqueeStrip } from "@/components/marquee-strip";
import { PageTransition } from "@/components/page-transition";
import { Reveal } from "@/components/reveal";
import { SectionDivider } from "@/components/section-divider";
import { fetchProducts } from "@/lib/products-api";
import Link from "next/link";

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <PageTransition>
      <section className="hero">
        <HeroVideo />
        <div className="hero-overlay" />
        <div className="hero-grid" />
        <div className="hero-content">
          <p className="hero-eyebrow">Dope Products For Dope People</p>
          <h1 className="hero-title"><img src="/brand/tfsp-pixel-logo.png" alt="TFSP" style={{ height: "clamp(60px, 12vw, 140px)", width: "auto", imageRendering: "pixelated" }} /></h1>
          <p className="hero-sub">MERCH - STICKERS - POSTERS</p>
          <div className="hero-ctas">
            <a href="#archive" className="btn btn-white">
              Browse Archive
            </a>
            <Link href="/checkout" className="btn btn-ghost">
              Place Order
            </Link>
          </div>
        </div>

      </section>

      <MarqueeStrip />

      <section id="archive">
        <Reveal>
          <h2 className="s-title">TFSP Collection</h2>
          <ArchiveTabs products={products} />
        </Reveal>
      </section>

      <SectionDivider />

      <section id="about">
        <Reveal>
          <div className="about-grid">
            <div>
              <p className="s-label">- The Story</p>
              <h2 className="s-title"><img src="/brand/tfsp-pixel-logo.png" alt="TFSP" style={{ height: "clamp(40px, 6vw, 70px)", width: "auto", imageRendering: "pixelated" }} /></h2>
              <p className="about-text">
                We started as Temro Fav Sticker Pasal - making stickers and posters for the people who move
                different. What began as a passion for bold visuals grew into something bigger. Now we&apos;ve launched
                our own merch line - oversized, cropped, and made for the streets of Kathmandu. From stickers to tees,
                every piece carries the same energy: dope products for dope people.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-n">KTM</span>
                  <span className="stat-l">Based In Nepal</span>
                </div>
                <div className="stat">
                  <span className="stat-n">10+</span>
                  <span className="stat-l">Store Items</span>
                </div>
                <div className="stat">
                  <span className="stat-n">100%</span>
                  <span className="stat-l">Dope</span>
                </div>
              </div>
            </div>
            <div className="about-vis">
              <div className="abox">*</div>
              <div className="abox">T</div>
              <div className="abox">F</div>
              <div className="abox">SP</div>
            </div>
          </div>
        </Reveal>
      </section>

      <SectionDivider />

      <section id="order">
        <Reveal>
          <p className="s-label">- Order</p>
          <h2 className="s-title">Order Now</h2>
          <div className="hero-ctas" style={{ justifyContent: "flex-start", marginTop: 16 }}>
            <Link href="/shop" className="btn btn-ghost">
              Open Shop
            </Link>
          </div>
        </Reveal>
      </section>

      <SectionDivider />

      <section id="instagram">
        <Reveal>
          <div className="ig-center">
            <p className="ig-desc">Latest drops, updates, behind-the-scenes, and drop notices.</p>
            <a className="btn btn-white ig-btn" href="https://www.instagram.com/tfsp__/" target="_blank" rel="noreferrer">
              Follow on Instagram
            </a>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  );
}