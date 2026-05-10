import { PageTransition } from "@/components/page-transition";
import { ProductDetailClient } from "@/components/product-detail-client";
import { fetchProductBySlug } from "@/lib/products-api";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) notFound();

  return (
    <PageTransition>
      <section className="page-shell">
        <ProductDetailClient product={product} />
      </section>
    </PageTransition>
  );
}