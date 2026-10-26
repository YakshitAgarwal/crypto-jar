"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Scale,
  TrendingUp,
  Wallet,
  ArrowRight,
  Info,
  CircleDollarSign,
  CheckCircle2,
} from "lucide-react";

const vaults = [
  {
    name: "Low",
    number: 1,
    risk: "Lower risk",
    description: "A conservative savings approach.",
    strategy: "Conservative",
    icon: ShieldCheck,
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    selected: "border-emerald-500 ring-2 ring-emerald-100",
  },
  {
    name: "Medium",
    number: 2,
    risk: "Moderate risk",
    description: "Balance potential yield and risk.",
    strategy: "Balanced",
    icon: Scale,
    accent: "border-blue-200 bg-blue-50 text-blue-700",
    selected: "border-blue-500 ring-2 ring-blue-100",
  },
  {
    name: "High",
    number: 3,
    risk: "Higher risk",
    description: "Pursue growth with greater risk.",
    strategy: "Growth focused",
    icon: TrendingUp,
    accent: "border-purple-200 bg-purple-50 text-purple-700",
    selected: "border-purple-500 ring-2 ring-purple-100",
  },
];

const Invest = () => {
  const [selectedVault, setSelectedVault] = useState("Low");
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  // Replace with the connected wallet's actual USDC balance.
  const usdcBalance = 100;

  const vault = vaults.find((item) => item.name === selectedVault)!;
  const numericAmount = Number(amount);
  const isValidAmount =
    amount.trim() !== "" &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    numericAmount <= usdcBalance;

  const formatUsd = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleInvest = () => {
    if (!isValidAmount) return;

    // Connect wallet approval + vault deposit here.
    setIsConfirming(true);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-[#f7f7f7] p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-[42px]">Invest</h1>
          <p className="mt-2 text-sm text-gray-500">
            Choose a jar and deposit USDC into your selected vault.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
          <div className="rounded-lg bg-gray-100 p-2">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Available balance</p>
            <p className="font-semibold">{formatUsd(usdcBalance)} USDC</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        {/* Main investment form */}
        <div className="flex flex-col gap-5">
          <section className="rounded-2xl bg-white p-5 sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">1. Choose your vault</h2>
              <p className="mt-1 text-sm text-gray-500">
                Select the vault you want to deposit into.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {vaults.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedVault === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setSelectedVault(item.name);
                      setIsConfirming(false);
                    }}
                    aria-pressed={isSelected}
                    className={`relative flex flex-col items-start rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? item.selected
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div
                      className={`mb-4 rounded-xl border p-2.5 ${item.accent}`}
                    >
                      <Icon size={22} />
                    </div>

                    <p className="font-semibold">{item.name} Vault</p>
                    <p className="mt-1 text-xs text-gray-500">{item.risk}</p>
                    <p className="mt-3 text-sm text-gray-600">
                      {item.description}
                    </p>

                    {isSelected && (
                      <span className="absolute right-3 top-3">
                        <CheckCircle2 size={18} className="text-gray-900" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold">2. Enter deposit amount</h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose how much USDC you want to invest.
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 p-4 focus-within:border-gray-500">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="invest-amount"
                  className="text-sm text-gray-500"
                >
                  Deposit amount
                </label>
                <span className="text-xs text-gray-500">USDC</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-3xl font-semibold">$</span>
                <input
                  id="invest-amount"
                  type="number"
                  min="0.01"
                  max={usdcBalance}
                  step="0.01"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setIsConfirming(false);
                  }}
                  placeholder="0.00"
                  className="w-full min-w-0 bg-transparent text-3xl font-semibold outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-gray-500">
                  Available: {formatUsd(usdcBalance)} USDC
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAmount(String(usdcBalance));
                    setIsConfirming(false);
                  }}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold transition hover:bg-gray-200"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[10, 25, 50, 100].map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={value > usdcBalance}
                  onClick={() => {
                    setAmount(String(value));
                    setIsConfirming(false);
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ${value}
                </button>
              ))}
            </div>

            {amount !== "" && !isValidAmount && (
              <p className="mt-3 text-sm text-red-600">
                Enter an amount greater than zero and no more than your
                available balance.
              </p>
            )}
          </section>
        </div>

        {/* Deposit summary */}
        <aside className="h-fit rounded-2xl bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Deposit summary</h2>
          <p className="mt-1 text-sm text-gray-500">Review your investment.</p>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
            <div className={`rounded-xl border p-2.5 ${vault.accent}`}>
              <vault.icon size={22} />
            </div>
            <div>
              <p className="font-semibold">{vault.name} Vault</p>
              <p className="text-xs text-gray-500">{vault.risk}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <SummaryRow
              label="Deposit amount"
              value={formatUsd(isValidAmount ? numericAmount : 0)}
            />
            <SummaryRow label="Asset" value="USDC" />
            <SummaryRow label="Network" value="Base Sepolia" />
            <SummaryRow label="Vault number" value={String(vault.number)} />
            <div className="border-t border-gray-100 pt-4">
              <SummaryRow
                label="Total deposit"
                value={formatUsd(isValidAmount ? numericAmount : 0)}
                bold
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!isValidAmount}
            onClick={handleInvest}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Review deposit
            <ArrowRight size={17} />
          </button>

          {isConfirming && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">
                Deposit ready for review
              </p>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                You selected {formatUsd(numericAmount)} USDC for the{" "}
                {vault.name} vault. Connect this step to your wallet approval
                and contract deposit flow to submit the transaction.
              </p>
            </div>
          )}

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3">
            <Info size={17} className="mt-0.5 shrink-0 text-gray-500" />
            <p className="text-xs leading-5 text-gray-500">
              Deposits require wallet confirmation and may require a USDC
              approval transaction. Network gas fees may apply.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const SummaryRow = ({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-sm text-gray-500">{label}</span>
    <span
      className={`text-right text-sm ${
        bold ? "font-semibold text-gray-900" : "font-medium text-gray-700"
      }`}
    >
      {value}
    </span>
  </div>
);

export default Invest;
