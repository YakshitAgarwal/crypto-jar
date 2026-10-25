"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Scale,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  Activity,
  Clock,
  Info,
  ChevronRight,
  CircleDollarSign,
  ChartNoAxesCombined,
  LockKeyhole,
} from "lucide-react";

const jars = [
  {
    name: "Low",
    roundup: "$1",
    title: "Conservative savings strategy",
    description:
      "Designed to prioritize capital preservation and a more cautious approach to DeFi.",
    risk: "Lower risk",
    riskDescription:
      "Lower risk does not mean risk-free. Smart contract, protocol, and stablecoin risks remain.",
    strategy: "Capital preservation focused",
    allocation: [
      { name: "Lower-risk lending", percentage: 70 },
      { name: "Liquid reserves", percentage: 30 },
    ],
    icon: ShieldCheck,
    color: "emerald",
  },
  {
    name: "Medium",
    roundup: "$5",
    title: "Balanced savings and growth",
    description:
      "Designed to balance potential yield with measured exposure to DeFi strategies.",
    risk: "Moderate risk",
    riskDescription:
      "Returns can fluctuate, and lending or protocol risks may result in losses.",
    strategy: "Balanced strategy",
    allocation: [
      { name: "Lending strategies", percentage: 50 },
      { name: "Growth strategies", percentage: 30 },
      { name: "Liquid reserves", percentage: 20 },
    ],
    icon: Scale,
    color: "blue",
  },
  {
    name: "High",
    roundup: "$10",
    title: "Higher growth potential",
    description:
      "Designed to pursue higher potential returns while accepting greater investment risk.",
    risk: "Higher risk",
    riskDescription:
      "Higher-risk DeFi strategies may experience larger losses, liquidity constraints, or smart contract exploits.",
    strategy: "Growth focused",
    allocation: [
      { name: "Growth strategies", percentage: 60 },
      { name: "Lending strategies", percentage: 25 },
      { name: "Liquid reserves", percentage: 15 },
    ],
    icon: TrendingUp,
    color: "purple",
  },
];

const Jars = () => {
  const [activeJar, setActiveJar] = useState("Low");

  const jar = jars.find((item) => item.name === activeJar)!;
  const JarIcon = jar.icon;

  // Placeholder values: replace with API/on-chain data.
  const stats = {
    deposited: 0,
    balance: 0,
    yield: 0,
    roundupCount: 0,
  };

  const formatUsd = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-[#f7f7f7] p-4 sm:p-6">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-semibold sm:text-[42px]">Jars</h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Explore your savings strategies, balances, and risk profiles.
        </p>
      </div>

      {/* Jar selector */}
      <div className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-white p-1.5">
        {jars.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActiveJar(item.name)}
            className={`whitespace-nowrap rounded-lg px-5 py-3 text-base font-medium transition sm:px-7 sm:text-lg ${
              activeJar === item.name
                ? "bg-black font-semibold text-white shadow"
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
            aria-pressed={activeJar === item.name}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Selected jar overview */}
      <section className="rounded-2xl bg-white p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100">
              <JarIcon size={28} className="text-gray-900" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold">{jar.name} Jar</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {jar.risk}
                </span>
              </div>
              <p className="mt-1 font-medium text-gray-700">{jar.title}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                {jar.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl bg-gray-50 px-5 py-4 sm:text-right">
            <p className="text-sm text-gray-500">Roundup increment</p>
            <p className="mt-1 text-3xl font-semibold">{jar.roundup}</p>
            <p className="mt-1 text-xs text-gray-500">
              Per payment, up to the next increment
            </p>
          </div>
        </div>
      </section>

      {/* Balance cards */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Your {jar.name} Jar</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Wallet size={20} />}
            label="Total deposited"
            value={formatUsd(stats.deposited)}
            description="Your contributions"
          />
          <StatCard
            icon={<CircleDollarSign size={20} />}
            label="Current balance"
            value={formatUsd(stats.balance)}
            description="Current jar value"
          />
          <StatCard
            icon={<ChartNoAxesCombined size={20} />}
            label="Yield earned / lost"
            value={formatUsd(stats.yield)}
            description="Net investment performance"
          />
          <StatCard
            icon={<Activity size={20} />}
            label="Completed roundups"
            value={String(stats.roundupCount)}
            description="Successful deposits"
          />
        </div>
      </section>

      {/* Strategy and allocation */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-3">
              <ChartNoAxesCombined size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Investment strategy</h2>
              <p className="text-sm text-gray-500">
                How this jar is intended to operate
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Strategy profile</p>
            <p className="mt-1 font-semibold">{jar.strategy}</p>
          </div>

          <div className="mt-5 flex items-start gap-3">
            <Info size={19} className="mt-0.5 shrink-0 text-gray-500" />
            <p className="text-sm leading-6 text-gray-500">
              The allocation below is illustrative only. It is not a live
              investment allocation and does not describe deployed funds unless
              your vault strategy actually implements it.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {jar.allocation.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-semibold">{item.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-900 transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk information */}
        <div className="rounded-2xl bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-3">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Risk information</h2>
              <p className="text-sm text-gray-500">
                Understand the risks before depositing
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 p-4">
            <p className="font-semibold">{jar.risk}</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {jar.riskDescription}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <RiskItem title="Smart contract risk">
              Bugs or exploits in contracts can result in loss of funds.
            </RiskItem>
            <RiskItem title="Stablecoin risk">
              USDC may face issuer, depeg, or other market-related risks.
            </RiskItem>
            <RiskItem title="Protocol and liquidity risk">
              Lending protocols may experience losses or delayed withdrawals.
            </RiskItem>
          </div>
        </div>
      </section>

      {/* Protocol and withdrawals */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-3">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Protocol details</h2>
              <p className="text-sm text-gray-500">
                Where and how funds are managed
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-gray-100">
            <DetailRow label="Network" value="Base Sepolia (testnet)" />
            <DetailRow label="Asset" value="USDC" />
            <DetailRow label="Vault" value={`${jar.name} Jar`} />
            <DetailRow label="Yield strategy" value="Not connected" />
            <DetailRow label="Performance data" value="Not available yet" />
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <p className="text-sm leading-6 text-gray-600">
              This is a testnet prototype. No live yield strategy is represented
              here. Connect a real strategy and verify its contracts before
              presenting live investment claims.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-3">
              <ArrowDownToLine size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Withdrawals</h2>
              <p className="text-sm text-gray-500">
                Understand access to your funds
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <DetailRow
              label="Available balance"
              value={formatUsd(stats.balance)}
            />
            <DetailRow label="Withdrawal status" value="Not connected" />
            <DetailRow label="Withdrawal fees" value="Not configured" />
            <DetailRow label="Processing time" value="Not configured" />
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <Clock size={20} className="mt-0.5 shrink-0 text-gray-500" />
            <p className="text-sm leading-6 text-gray-600">
              Withdrawal availability depends on your smart contract and any
              connected investment protocol. Display actual withdrawal
              conditions here once implemented.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-400"
          >
            Withdraw funds
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer note */}
      <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-gray-500" />
        <p className="text-sm leading-6 text-gray-500">
          Crypto assets and DeFi strategies involve risk. Risk labels describe
          intended strategy profiles, not guaranteed outcomes. Always verify
          balances and strategy information against actual contract data.
        </p>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) => (
  <div className="rounded-2xl bg-white p-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-gray-500">{label}</p>
      <span className="text-gray-500">{icon}</span>
    </div>
    <p className="mt-4 break-words text-2xl font-semibold">{value}</p>
    <p className="mt-2 text-xs text-gray-500">{description}</p>
  </div>
);

const RiskItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-sm font-semibold">{title}</p>
    <p className="mt-1 text-sm leading-6 text-gray-500">{children}</p>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-right text-sm font-medium text-gray-900">
      {value}
    </span>
  </div>
);

export default Jars;
