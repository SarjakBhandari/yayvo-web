// admin/hooks/useConsumers.ts
import { useEffect, useState, useCallback } from "react";
import { listConsumersPaginated } from "@/lib/api/admin";

export function useConsumers(initialPage = 1, initialSize = 10) {
  const [consumers, setConsumers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [size, setSize] = useState<number>(initialSize);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (p = initialPage, s = initialSize, q = "") => {
      setLoading(true);
      setError(null);
      try {
        const res = await listConsumersPaginated({ page: p, size: s, search: q });

        // Debugging: uncomment to inspect the normalized response
        // console.debug("useConsumers normalized response:", res);

        // Defensive assignments
        setConsumers(Array.isArray(res.items) ? res.items : []);
        setTotal(typeof res.total === "number" ? res.total : 0);
        setPage(typeof res.page === "number" ? res.page : p);
        setSize(typeof res.size === "number" ? res.size : s);
      } catch (err: any) {
        console.error("Failed to fetch consumers:", err);
        setError(err?.message || "Failed to load consumers");
        // keep previous consumers array instead of nulling it
      } finally {
        setLoading(false);
      }
    },
    [initialPage, initialSize]
  );

  useEffect(() => {
    fetch(initialPage, initialSize, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPage = (p: number) => fetch(p, size, search);
  const setPageSize = (s: number) => fetch(1, s, search);
  const doSearch = (q: string) => {
    setSearch(q);
    fetch(1, size, q);
  };
  const refresh = () => fetch(page, size, search);

  return {
    consumers,
    setConsumers,
    page,
    size,
    total,
    search,
    loading,
    error,
    goToPage,
    setPageSize,
    doSearch,
    refresh,
  };
}
