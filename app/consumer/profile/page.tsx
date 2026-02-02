// app/consumer/profile/page.tsx

import React from "react";
import { redirect } from "next/navigation";
import ProfilePanel from "../_components/profilePanel"; // client component
import { getUserData, getAuthToken } from "@/lib/cookie"; // server cookie helpers
import { API } from "@/lib/api/endpoints";
import { getConsumerByAuthId } from "@/lib/api/consumer";
import Sidebar from "../_components/sidebar";

type Consumer = {
  _id: string;
  authId: string;
  fullName: string;
  username: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  country?: string;
  profilePicture?: string | null;
  createdAt?: string;
  updatedAt?: string;
};



export default async function ConsumerProfilePage() {
  // read cookies server-side
  const userData = await getUserData();
  const token = await getAuthToken();
    console.log(userData);
  // determine authId from cookie user_data


  // fetch consumer profile server-side using authId and token
  const consumer = await getConsumerByAuthId(userData.id as string);
  if (!consumer) {
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
          {/* ProfilePanel is a client component; pass the server-fetched consumer object */}
          {/* @ts-ignore-next-line */}
          <ProfilePanel consumer={consumer}  />
        </div>
      </main>
    </div>
  );
}
