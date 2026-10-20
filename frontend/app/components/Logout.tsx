"use client";

import { useState } from "react";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { mutateAsync } = useDisconnect();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await mutateAsync();
      router.push("/");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 rounded-2xl bg-[#f7f7f7] p-6">
      <div className="text-[42px] font-semibold">Logout</div>

      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Are you sure you want to log out?
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Your wallet will be disconnected from CryptoJar. Your on-chain funds
            will not be affected.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            disabled={isLoggingOut}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5
              text-sm font-medium text-gray-700 transition hover:bg-gray-100
              disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm
              font-medium text-white transition hover:bg-red-700
              disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Yes, log out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
