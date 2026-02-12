// src/app/retailer/_components/RetailerProductsGrid.tsx
"use client";
import React, { useState } from "react";
import type { Product } from "../_schemas/product.schema";
import RetailerProductCard from "./RetaileProductCard";

export default function RetailerProductsGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleUpdate = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 12,
        marginTop: 12,
      }}
    >
      {products.map((p) => (
        <RetailerProductCard
          key={p._id}
          product={p}
          onDeleted={handleDelete}
          onUpdated={handleUpdate}
        />
      ))}
    </div>
  );
}
