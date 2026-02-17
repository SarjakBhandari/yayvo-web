"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "../_components/sidebar";

export default function CollectionHubPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ padding: 24, flex: 1 }}>
        <h1>Collections</h1>
        <p>Select a section:</p>
        <ul>
          <li><Link href="/consumer/collection/saved">Saved Collections</Link></li>
          <li><Link href="/consumer/collection/liked">Liked Collections</Link></li>
        </ul>
      </main>
    </div>
  );
}
