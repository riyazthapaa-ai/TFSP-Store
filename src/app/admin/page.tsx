"use client";

import { PageTransition } from "@/components/page-transition";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);

    if (!res.ok) {
      setError("Invalid password");
      return;
    }

    sessionStorage.setItem("tfsp-admin-auth", "1");
    router.push("/admin/products");
  };

  return (
    <PageTransition>
      <section className="page-shell" style={{ minHeight: "calc(100vh - 120px)", display: "grid", placeItems: "center" }}>
        <div className="panel" style={{ width: "100%", maxWidth: 460 }}>
          <p className="s-label">Admin Access</p>
          <h1 className="s-title" style={{ marginBottom: 14 }}>
            TFSP
          </h1>
          <p className="about-text" style={{ marginBottom: 18 }}>
            Sign in to manage products and orders.
          </p>
          <div className="field">
            <label>Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? submit() : null)}
              placeholder="Enter password"
            />
          </div>
          {error ? <p className="item-moq" style={{ color: "#d87f7f" }}>{error}</p> : null}
          <button className="btn btn-white" type="button" onClick={submit} disabled={loading || !password} style={{ width: "100%" }}>
            {loading ? "Checking..." : "Login"}
          </button>
        </div>
      </section>
    </PageTransition>
  );
}