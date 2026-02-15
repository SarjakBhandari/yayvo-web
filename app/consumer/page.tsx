// app/consumer/home/page.tsx
import React from "react";
import Sidebar from "./_components/sidebar";
import HomeClient from "./_components/HomeClient";
import { getUserData } from "@/lib/cookie";

export default async function HomePage() {
  const userData = await getUserData();
  console.log("the data after getUserData:",userData);
  return (
    <div style={{ height: "100vh", display: "flex", gap: 24 }}>
      <div style={{ flex: "0 0 260px", display: "flex", alignItems: "flex-start", padding: 24 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24 }}>
        <HomeClient userData={userData} />
      </div>
    </div>
  );
}
