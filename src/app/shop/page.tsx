import { ArchiveTabs } from "@/components/archive-tabs";
import { PageTransition } from "@/components/page-transition";
import { Reveal } from "@/components/reveal";
import { fetchProducts } from "@/lib/products-api";

export default async function ShopPage() {
  const products = await fetchProducts();

  return (
    <PageTransition>
      <section className="page-shell" id="shop">
        <Reveal>
          <p className="s-label">— Shop</p>
          <h1 className="s-title">Full Product Grid</h1>
          <ArchiveTabs fullGrid products={products} />
        </Reveal>
      </section>
    </PageTransition>
  );
}