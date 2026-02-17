// app/consumer/profile/page.tsx

import React from "react";
import { redirect } from "next/navigation";
import ProfilePanel from "../_components/profilePanel";
import { getUserData, getAuthToken } from "@/lib/cookie";
import { getConsumerByAuthId } from "@/lib/api/consumer";
import Sidebar from "../_components/sidebar";
import ConsumerReviews from "../_components/reviews";
import { getCurrentUser } from "@/lib/actions/consumer-actions";

export default async function ConsumerProfilePage() {
  const userData = await getCurrentUser();
  const authId = userData?.user.id ?? null;

  if (!authId) {
    redirect("/login");
  }

  // unwrap the response
  const resp = await getConsumerByAuthId(authId as string);
  const consumer = resp?.data;

  if (!consumer) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:block">
        {/* @ts-ignore-next-line */}
        <Sidebar />
      </aside>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Pass the actual consumer object */}
          {/* @ts-ignore-next-line */}
          <ProfilePanel consumer={consumer} />

          {/* Pass just the authId string */}
          <ConsumerReviews authId={consumer.authId} />
        </div>
      </main>
    </div>
  );
}
