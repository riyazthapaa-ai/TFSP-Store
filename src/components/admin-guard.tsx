"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem("tfsp-admin-auth") === "1";
    if (!ok) {
      router.replace("/admin");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}
