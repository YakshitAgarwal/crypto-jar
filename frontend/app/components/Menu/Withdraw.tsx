"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Scale,
  TrendingUp,
  Wallet,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import SummaryRow from "../Invest/SummaryRow";

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
    balance: 0,
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
    balance: 0,
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
    balance: 0,
  },
];

const Withdraw = () => {
  const [selectedVault, setSelectedVault] = useState("Low");
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  // Replace these placeholder balances with the actual on-chain vault balances.
  const vault = vaults.find((item) => item.name === selectedVault)!;
  const availableBalance = vault.balance;

  const totalWithdrawable = vaults.reduce((sum, item) => sum + item.balance, 0);

  const numericAmount = Number(amount);

  const isValidAmount =
    amount.trim() !== "" &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    numericAmount <= availableBalance;

  const formatUsd = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleWithdraw = () => {
    if (!isValidAmount) return;

    // Connect this step to your wallet and contract withdrawal function.
    setIsConfirming(true);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#f7f7f7] p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">Withdraw</h1>
          <p className="mt-1 text-sm text-gray-500">
            Withdraw your USDC savings from your selected CryptoJar vault.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
          <div className="rounded-lg bg-gray-100 p-2">
            <Wallet size={20} />
          </div>

          <div>
            <p className="text-xs text-gray-500">Total withdrawable</p>
            <p className="font-semibold">{formatUsd(totalWithdrawable)} USDC</p>
          </div>
        </div>
      </div>

      {/* Main withdrawal layout */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        {/* Withdrawal form */}
        <div className="flex flex-col gap-4">
          {/* Choose vault */}
          <section className="rounded-2xl bg-white p-5 sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">1. Choose your vault</h2>
              <p className="mt-1 text-sm text-gray-500">
                Select the vault you want to withdraw from.
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
                      setAmount("");
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

                    <p className="mt-3 text-sm font-semibold">
                      {formatUsd(item.balance)}
                    </p>
                    <p className="text-xs text-gray-400">Available balance</p>

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

          {/* Enter withdrawal amount */}
          <section className="rounded-2xl bg-white p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold">
                2. Enter withdrawal amount
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose how much USDC you want to withdraw.
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 p-4 focus-within:border-gray-500">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="withdraw-amount"
                  className="text-sm text-gray-500"
                >
                  Withdrawal amount
                </label>
                <span className="text-xs text-gray-500">USDC</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-3xl font-semibold">$</span>
                <input
                  id="withdraw-amount"
                  type="number"
                  min="0.01"
                  max={availableBalance}
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
                  Available: {formatUsd(availableBalance)} USDC
                </p>

                <button
                  type="button"
                  disabled={availableBalance <= 0}
                  onClick={() => {
                    setAmount(String(availableBalance));
                    setIsConfirming(false);
                  }}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="mt-4 flex flex-wrap gap-2">
                {[10, 25, 50, 100].map((percentage) => {
                  const quickAmount =
                    Math.floor(((availableBalance * percentage) / 100) * 100) /
                    100;

                  return (
                    <button
                      key={percentage}
                      type="button"
                      disabled={quickAmount <= 0}
                      onClick={() => {
                        setAmount(String(quickAmount));
                        setIsConfirming(false);
                      }}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {percentage}%
                    </button>
                  );
                })}
              </div>

              <div>
                {amount !== "" && !isValidAmount && (
                  <p className="mt-3 text-sm text-red-600">
                    Enter an amount greater than zero and no more than your
                    available vault balance.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Withdrawal summary */}
        <aside className="flex h-full flex-col justify-between rounded-2xl bg-white p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold">Withdrawal summary</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review your withdrawal.
            </p>

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
                label="Withdrawal amount"
                value={formatUsd(isValidAmount ? numericAmount : 0)}
              />
              <SummaryRow label="Asset" value="USDC" />
              <SummaryRow label="Network" value="Base Sepolia" />
              <SummaryRow label="Vault number" value={String(vault.number)} />

              <div className="border-t border-gray-100 pt-4">
                <SummaryRow
                  label="Total withdrawal"
                  value={formatUsd(isValidAmount ? numericAmount : 0)}
                  bold
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              disabled={!isValidAmount}
              onClick={handleWithdraw}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Review withdrawal
              <ArrowRight size={17} />
            </button>

            {isConfirming && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-800">
                  Withdrawal ready for review
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  You selected {formatUsd(numericAmount)} USDC from the{" "}
                  {vault.name} vault. Connect this step to your wallet and smart
                  contract to submit the withdrawal.
                </p>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3">
              <Info size={17} className="mt-0.5 shrink-0 text-gray-500" />
              <p className="text-xs leading-5 text-gray-500">
                Withdrawals require wallet confirmation. Network gas fees may
                apply. Your actual withdrawable amount depends on your vault
                balance and contract rules.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom information section */}
      <section className="mt-auto rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">
              Your savings, available when you need them.
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Choose a vault, enter your withdrawal amount, and review the
              details before confirming the transaction in your wallet.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={17} className="text-emerald-600" />
            <span>Self-custodied savings</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Withdraw;
