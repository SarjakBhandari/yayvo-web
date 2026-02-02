// app/consumer/dashboard/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./_components/sidebar";
import { handleLogout } from "@/lib/actions/auth-actions";


export default function Page() {
  return (
   <div><Sidebar/></div>
  );
}
