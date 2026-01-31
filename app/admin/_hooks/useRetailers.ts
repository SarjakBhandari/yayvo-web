// admin/hooks/useRetailers.ts
import { listRetailers } from "@/lib/api/admin";
import { useEffect, useState } from "react";

export function useRetailers() {
  const [retailers, setRetailers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listRetailers()
      .then((data) => { if (mounted) setRetailers(data || []); })
      .catch((e) => { if (mounted) setError(e.message || "Failed"); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { retailers, setRetailers, loading, error };
}
