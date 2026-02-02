// app/retailer/profile/page.tsx

import React from "react";
import { redirect } from "next/navigation";
import RetailerProfilePanel from "../_components/profilePanel"; // client component
import { getUserData, getAuthToken } from "@/lib/cookie"; // server cookie helpers
import { getRetailerByAuthId } from "@/lib/api/retailer";
import Sidebar from "../_components/sidebar";

type Retailer = {
  _id: string;
  authId: string;
  ownerName: string;
  organizationName: string;
  username: string;
  phoneNumber?: string;
  dateOfEstablishment?: string;
  country?: string;
  logo?: string | null;
  website?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default async function RetailerProfilePage() {
  // read cookies server-side
  const userData = await getUserData();
  const token = await getAuthToken();

  // determine authId from cookie user_data
  const authId = userData?.id ?? null;
  if (!authId) {
    redirect("/login");
  }

  // fetch retailer profile server-side using authId and token
  const retailer = await getRetailerByAuthId(authId as string);
  if (!retailer) {
    // if fetch failed, redirect to login or show fallback
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:block">
        {/* Client wrapper provides navigation and logout handlers */}
        {/* @ts-ignore-next-line */}
        <Sidebar />
      </aside>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          {/* RetailerProfilePanel is a client component; pass the server-fetched retailer object */}
          {/* @ts-ignore-next-line */}
          <RetailerProfilePanel retailer={retailer} />
        </div>
      </main>
    </div>
  );
}
