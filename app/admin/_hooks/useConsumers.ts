// admin/hooks/useConsumers.ts
import { listConsumers } from "@/lib/api/admin";
import { useEffect, useState } from "react";

export function useConsumers() {
  const [consumers, setConsumers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listConsumers()
      .then((data) => { if (mounted) setConsumers(data || []); })
      .catch((e) => { if (mounted) setError(e.message || "Failed"); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { consumers, setConsumers, loading, error };
}
