// src/app/retailer/_components/RetailerProductsGrid.tsx
"use client";
import React, { useState } from "react";
import type { Product } from "../_schemas/product.schema";
import RetailerProductCard from "./RetaileProductCard";

export default function RetailerProductsGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleDelete = (id: string) => setProducts((prev) => prev.filter((p) => p._id !== id));
  const handleUpdate = (updated: Product) => setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  if (products.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');
          .rpg-empty {
            font-family: 'DM Sans', sans-serif;
            display: flex; flex-direction: column; align-items: center;
            gap: 10px; padding: 60px 20px; text-align: center;
          }
          .rpg-empty-icon {
            width: 56px; height: 56px; border-radius: 16px;
            background: #F0EBE1; display: flex; align-items: center; justify-content: center;
            font-size: 24px;
          }
          .rpg-empty-msg { font-size: 14px; color: #9C8E7A; }
        `}</style>
        <div className="rpg-empty">
          <div className="rpg-empty-icon">📦</div>
          <div className="rpg-empty-msg">No products yet. Create one to get started.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .rpg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
      `}</style>
      <div className="rpg-grid">
        {products.map((p) => (
          <RetailerProductCard key={p._id} product={p} onDeleted={handleDelete} onUpdated={handleUpdate} />
        ))}
      </div>
    </>
  );
}