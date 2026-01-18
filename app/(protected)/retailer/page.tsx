"use client";

import { useRouter } from "next/navigation";
import { handleLogout } from "@/lib/actions/auth-actions";

export default function Page() {
  const router = useRouter();

  const logout = async () => {
    try {
      await handleLogout(); // clears cookies
      router.push("/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div>
      <h1>This is retailer dashboard</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded-md mt-4"
      >
        Logout
      </button>
    </div>
  );
}
