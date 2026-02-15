"use client";
import React, { useEffect, useState } from "react";
import type { Product } from "../../retailer/_schemas/product.schema";
import { getProductsClient } from "../../../lib/actions/product-actions"; // use client wrapper
import ProductCard from "./productcard";

type Props = {
  initialProducts?: Product[];
  excludeAuthId?: string | null;
  currentUserId?: string | null; // pass down for like button
};

export default function ProductsClient({ initialProducts = [], excludeAuthId, currentUserId }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // helper to filter out excluded authId
  function filterProducts(items: Product[]) {
    return excludeAuthId ? items.filter((p) => p.retailerAuthId !== excludeAuthId) : items;
  }

  useEffect(() => {
    setProducts(filterProducts(initialProducts));
  }, [initialProducts, excludeAuthId]);

  async function doSearch(q: string) {
    setLoading(true);
    try {
      const data = await getProductsClient(q?.trim() ? q.trim() : undefined);
      const items: Product[] = data?.items || [];
      setProducts(filterProducts(items));
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="searchRow">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              doSearch(search);
            }
          }}
        />
        <button onClick={() => doSearch(search)} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      <div className="grid">
        {loading ? (
          <div className="empty">Loading…</div>
        ) : products.length === 0 ? (
          <div className="empty">No products found.</div>
        ) : (
          products.map((p) => (
            <ProductCard key={p._id} product={p} currentUserId={currentUserId} />
          ))
        )}
      </div>

      <style jsx>{`
        .searchRow {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        input {
          flex: 1;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #e6e6e6;
        }
        button {
          padding: 8px 12px;
          border-radius: 8px;
          background: #111827;
          color: #fff;
          border: none;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }
        .empty {
          color: #6b7280;
          padding: 12px;
          background: #fff;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
