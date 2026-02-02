"use client";

import { useRouter } from "next/navigation";
import Sidebar from "./_components/sidebar";
import { handleLogout } from "@/lib/actions/auth-actions";

export default function Layout({children}: {children: React.ReactNode}) {
      const router = useRouter();
    
    return (
        <section>
            {children}
        </section>
    );
}