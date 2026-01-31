// admin/hooks/useUser.ts
import { getConsumer, getRetailer } from "@/lib/api/admin";
import { useEffect, useState } from "react";

export function useUser(id?: string, role?: "consumer" | "retailer" | "auto") {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        if (role === "consumer") {
          const u = await getConsumer(id);
          if (mounted) setUser({ ...u, _role: "consumer" });
        } else if (role === "retailer") {
          const u = await getRetailer(id);
          if (mounted) setUser({ ...u, _role: "retailer" });
        } else {
          try {
            const u = await getConsumer(id);
            if (mounted) setUser({ ...u, _role: "consumer" });
          } catch {
            const r = await getRetailer(id);
            if (mounted) setUser({ ...r, _role: "retailer" });
          }
        }
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load user");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, role]);

  return { user, setUser, loading, error };
}
