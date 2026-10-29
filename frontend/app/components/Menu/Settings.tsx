"use client";

import { useState } from "react";
import { useConnection, useDisconnect } from "wagmi";
import {
  UserRound,
  Wallet,
  ShieldCheck,
  Bell,
  PiggyBank,
  ChevronRight,
  Copy,
  Check,
  LogOut,
  CircleHelp,
} from "lucide-react";

const Settings = () => {
  const { address, isConnected } = useConnection();
  const { disconnect } = useDisconnect();

  const [notifications, setNotifications] = useState({
    transactions: true,
    savings: true,
    security: true,
  });

  const [copied, setCopied] = useState(false);
  const [riskPreference, setRiskPreference] = useState("LOW");

  const copyAddress = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Unable to copy wallet address:", error);
    }
  };

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Not connected";

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden rounded-2xl bg-[#f7f7f7] p-5 md:p-6">
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-3xl font-semibold tracking-tight md:text-[42px]">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your account, wallet, and CryptoJar preferences.
        </p>
      </div>

      {/* Scrollable settings content */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {/* Account */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-2.5">
              <UserRound size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Account</h2>
              <p className="text-sm text-gray-500">
                Your CryptoJar account information
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-gray-100 py-4">
            <div>
              <p className="text-sm text-gray-500">Account status</p>
              <p className="mt-1 font-medium">
                {isConnected ? "Wallet connected" : "Wallet disconnected"}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isConnected
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isConnected ? "Active" : "Inactive"}
            </span>
          </div>
        </section>

        {/* Wallet */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-2.5">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Wallet</h2>
              <p className="text-sm text-gray-500">
                Manage your connected wallet
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Wallet address</p>
              <p className="mt-1 break-all font-medium">{shortAddress}</p>
            </div>

            {address && (
              <button
                onClick={copyAddress}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy address"}
              </button>
            )}
          </div>

          {isConnected && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => disconnect()}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <span className="flex items-center gap-3">
                  <LogOut size={18} />
                  Disconnect wallet
                </span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </section>

        {/* Savings preferences */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-2.5">
              <PiggyBank size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Savings preferences</h2>
              <p className="text-sm text-gray-500">
                Choose your preferred savings risk level
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
            {[
              {
                value: "LOW",
                title: "Low risk",
                description: "$1 roundup",
              },
              {
                value: "MEDIUM",
                title: "Medium risk",
                description: "$5 roundup",
              },
              {
                value: "HIGH",
                title: "High risk",
                description: "$10 roundup",
              },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setRiskPreference(option.value)}
                className={`rounded-xl border p-4 text-left transition ${
                  riskPreference === option.value
                    ? "border-black bg-gray-50 ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{option.title}</span>
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      riskPreference === option.value
                        ? "border-black bg-black ring-2 ring-gray-200"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {option.description}
                </p>
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Changing this selection currently updates the page only. Connect it
            to your user settings API to save the preference.
          </p>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-2.5">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-gray-500">
                Choose which updates you want to receive
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {[
              {
                key: "transactions" as const,
                title: "Transaction updates",
                description: "Updates about deposits and withdrawals",
              },
              {
                key: "savings" as const,
                title: "Savings activity",
                description: "Updates when your savings change",
              },
              {
                key: "security" as const,
                title: "Security alerts",
                description: "Important wallet and security notifications",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications[item.key]}
                  aria-label={item.title}
                  onClick={() => toggleNotification(item.key)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    notifications[item.key] ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      notifications[item.key] ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            These notification switches are currently local UI settings. They do
            not send or suppress notifications yet.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
