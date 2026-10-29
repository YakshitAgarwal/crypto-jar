"use client";

import { useState } from "react";
import { useDisconnect, useConnection } from "wagmi";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ShieldCheck,
  Wallet,
  ArrowLeft,
  Info,
  CheckCircle2,
} from "lucide-react";

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { mutateAsync: disconnect } = useDisconnect();
  const { address } = useConnection();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await disconnect();
      router.push("/");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col gap-5 rounded-2xl bg-[#f7f7f7] p-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-950">
          Logout
        </h1>
        <p className="text-sm mt-1 text-gray-500">
          Safely disconnect your wallet from CryptoJar.
        </p>
      </div>

      {/* Main content */}
      <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        {/* Confirmation panel */}
        <div className="flex flex-col justify-between gap-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-8">
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <LogOut size={27} strokeWidth={1.8} />
            </div>

            {/* Confirmation message */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                Are you sure you want to log out?
              </h2>

              <p className="max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                Your wallet will be disconnected from CryptoJar. You can
                reconnect it whenever you want to access your savings again.
              </p>
            </div>

            {/* Wallet details */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-[#fafafa] p-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Wallet size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Connected wallet
                </p>
                <p className="mt-1 break-all font-mono text-xs text-gray-500 sm:text-sm">
                  {address
                    ? `${address.slice(0, 8)}...${address.slice(-6)}`
                    : "No wallet connected"}
                </p>
              </div>

              <CheckCircle2
                size={19}
                className="mt-1 shrink-0 text-green-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={16} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={16} />
              {isLoggingOut ? "Logging out..." : "Yes, log out"}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Safety card */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
              <ShieldCheck size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-950">
                Your funds stay yours
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Logging out only disconnects your wallet from this app. It does
                not transfer or withdraw your on-chain funds.
              </p>
            </div>
          </div>

          {/* Information card */}
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 text-gray-900">
              <Info size={18} />
              <h3 className="text-sm font-semibold">Before you leave</h3>
            </div>

            <ul className="flex flex-col gap-3 text-sm leading-6 text-gray-600">
              <li className="flex gap-2">
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-gray-500"
                />
                Your on-chain savings remain in their current location.
              </li>
              <li className="flex gap-2">
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-gray-500"
                />
                You can reconnect the same wallet later.
              </li>
              <li className="flex gap-2">
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-gray-500"
                />
                Keep your wallet recovery phrase private and secure.
              </li>
            </ul>
          </div>

          {/* Bottom-right savings snapshot */}
          <div className="relative min-h-[190px] overflow-hidden rounded-2xl bg-[#e9f5ed] p-5">
            {/* Decorative background */}
            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#cce8d5]/70" />
            <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-[#d5eddd]/80" />

            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-green-800">
                  <Wallet size={22} strokeWidth={1.8} />
                </div>

                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-green-800">
                  CryptoJar
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-green-900/70">
                  Small steps. Bigger savings.
                </p>

                <h3 className="mt-2 max-w-[240px] text-2xl font-semibold leading-tight tracking-tight text-green-950">
                  Every little bit adds up.
                </h3>

                <p className="mt-2 text-sm leading-6 text-green-900/70">
                  Your next savings milestone starts when you return.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-green-900">
                <ShieldCheck size={17} />
                <span>Your savings journey continues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
