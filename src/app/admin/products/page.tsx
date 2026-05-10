"use client";

import { AdminGuard } from "@/components/admin-guard";
import { PageTransition } from "@/components/page-transition";
import { Product, ProductCategory } from "@/types/product";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProductForm = {
  id: string;
  name: string;
  slug: string;
  price: string;
  oldPrice: string;
  category: ProductCategory;
  description: string;
  collection: string;
  sizes: string;
  colors: string;
  stock: string;
  badge: string;
  imageUrl: string;
  minQty: string;
};

const emptyForm: ProductForm = {
  id: "",
  name: "",
  slug: "",
  price: "",
  oldPrice: "",
  category: "tees",
  description: "",
  collection: "TFSP",
  sizes: "",
  colors: "",
  stock: "",
  badge: "",
  imageUrl: "",
  minQty: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = (await res.json()) as Product[];
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async () => {
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price || 0),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock || 0),
      minQty: form.minQty ? Number(form.minQty) : undefined,
      tagline: form.description,
      description: form.description,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(",").map((s) => s.trim()).filter(Boolean) : [],
      badge: (form.badge || undefined) as Product["badge"],
    };

    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    await load();
    setLoading(false);
  };

  const editProduct = (p: Product) => {
    setShowForm(true);
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: String(p.price ?? ""),
      oldPrice: p.oldPrice !== undefined ? String(p.oldPrice) : "",
      category: p.category,
      description: p.description || p.tagline || "",
      collection: p.collection || "TFSP",
      sizes: (p.sizes || []).join(", "),
      colors: (p.colors || []).join(", "),
      stock: String(p.stock ?? ""),
      badge: p.badge || "",
      imageUrl: p.imageUrl || "",
      minQty: p.minQty !== undefined ? String(p.minQty) : "",
    });
  };

  const deleteProduct = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <AdminGuard>
      <PageTransition>
        <section className="page-shell admin-shell">
          <div className="admin-topnav">
            <div>
              <p className="s-label">Admin</p>
              <h1 className="s-title">Products</h1>
            </div>
            <div className="admin-nav-links">
              <button className="btn btn-white" type="button" onClick={() => setShowForm((v) => !v)}>
                {showForm ? "Close Form" : "Add Product"}
              </button>
              <Link href="/admin/products" className="btn btn-ghost">
                Products
              </Link>
              <Link href="/admin/orders" className="btn btn-ghost">
                Orders
              </Link>
              <Link href="/" className="btn btn-ghost">
                Back to Store
              </Link>
            </div>
          </div>

          {showForm ? (
          <div className="panel">
            <p className="pb-cat">{editingId ? "Edit Product" : "Add Product"}</p>
            <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="field">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-");
                    setForm({ ...form, name, slug: editingId ? form.slug : autoSlug });
                  }}
                />
              </div>
              <div className="field">
                <label>Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}>
                  <option value="tees">tees</option>
                  <option value="stickers">stickers</option>
                  <option value="posters">posters</option>
                </select>
              </div>
              <div className="field">
                <label>Collection</label>
                <input value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })} />
              </div>
              <div className="field">
                <label>Price</label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="field">
                <label>Old Price</label>
                <input value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
              </div>
              <div className="field">
                <label>Stock</label>
                <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="field">
                <label>Badge</label>
                <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
                  <option value="">none</option>
                  <option value="NEW">NEW</option>
                  <option value="LIMITED">LIMITED</option>
                </select>
              </div>
              <div className="field">
                <label>Sizes (comma separated)</label>
                <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
              </div>
              <div className="field">
                <label>Colors (comma separated)</label>
                <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
              </div>
              <div className="field">
                <label>Min Qty</label>
                <input value={form.minQty} onChange={(e) => setForm({ ...form, minQty: e.target.value })} />
              </div>
              <div className="field">
                <label>Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-white" type="button" onClick={onSave} disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
              {editingId ? (
                <button className="btn btn-ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(false); }}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </div>
          ) : null}

          <div className="panel">
            <p className="pb-cat">All Products</p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                        <span className="status-badge">{p.stock > 0 ? "Active" : "Out of stock"}</span>
                      </td>
                      <td style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost" type="button" onClick={() => editProduct(p)}>
                          Edit
                        </button>
                        <button className="btn btn-ghost" type="button" onClick={() => deleteProduct(p.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </PageTransition>
    </AdminGuard>
  );
}
