// app/consumer/profile/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import ProfilePanel from "../_components/profilePanel";
import { getConsumerByAuthId } from "@/lib/api/consumer";
import Sidebar from "../_components/sidebar";
import ConsumerReviews from "../_components/reviews";
import { getCurrentUser } from "@/lib/actions/consumer-actions";

export default async function ConsumerProfilePage() {
  const userData = await getCurrentUser();
  const authId = userData?.user.id ?? null;

  if (!authId) redirect("/login");

  const resp = await getConsumerByAuthId(authId as string);
  const consumer = resp?.data;

  if (!consumer) redirect("/login");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .profile-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Ambient blobs */
        .profile-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .profile-blob-1 {
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(201,169,110,0.11) 0%, transparent 70%);
          top: -120px; left: 200px;
        }
        .profile-blob-2 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: 40px; right: 60px;
        }

        /* Sidebar */
        .profile-sidebar-col {
          position: relative;
          z-index: 1;
          flex: 0 0 260px;
          padding: 28px 0 28px 28px;
          display: flex;
          flex-direction: column;
        }
        .profile-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex;
          flex-direction: column;
        }

        /* Main scrollable area */
        .profile-main {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 28px 28px 40px 16px;
          overflow-y: auto;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 32px;
          scrollbar-width: thin;
          scrollbar-color: #D4C8B4 transparent;
        }
        .profile-main::-webkit-scrollbar { width: 4px; }
        .profile-main::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        .profile-inner {
          max-width: 860px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Divider between profile panel and reviews */
        .profile-section-divider {
          height: 1px;
          background: linear-gradient(to right, #E8E4DC 0%, transparent 100%);
        }

        @media (max-width: 768px) {
          .profile-sidebar-col { display: none; }
          .profile-main { padding: 20px; }
        }
      `}</style>

      <div className="profile-root">
        <div className="profile-blob profile-blob-1" />
        <div className="profile-blob profile-blob-2" />

        {/* Sidebar */}
        <div className="profile-sidebar-col">
          <div className="profile-sidebar-panel">
            <Sidebar />
          </div>
        </div>

        {/* Main */}
        <main className="profile-main">
          <div className="profile-inner">
            <ProfilePanel consumer={consumer} />
            <div className="profile-section-divider" />
            <ConsumerReviews authId={consumer.authId} />
          </div>
        </main>
      </div>
    </>
  );
}