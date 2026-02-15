// app/consumer/create/page.tsx
import React from "react";
import Sidebar from "../_components/sidebar";
import CreateClient from "./CreateClient";
import { getUserData } from "@/lib/cookie";

export default async function CreatePage() {
  const userData = await getUserData(); // server-side cookie read
  return (
    <div className="page" style={{ display: "flex", gap: 24, padding: 24 }}>
      <Sidebar />
      <CreateClient userData={userData} />
    </div>
  );
}
