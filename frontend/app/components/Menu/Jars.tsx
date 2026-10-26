"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Scale,
  TrendingUp,
  Wallet,
  CircleDollarSign,
  Activity,
  ChartNoAxesCombined,
  Info,
} from "lucide-react";

const jars = [
  {
    name: "Low",
    roundup: "$1",
    title: "Conservative savings strategy",
    description: "Prioritize a cautious approach to saving.",
    risk: "Lower risk",
    strategy: "Capital preservation focused",
    allocation: [
      { name: "Lower-risk lending", percentage: 70 },
      { name: "Liquid reserves", percentage: 30 },
    ],
    icon: ShieldCheck,
  },
  {
    name: "Medium",
    roundup: "$5",
    title: "Balanced savings and growth",
    description: "Balance potential yield with measured risk.",
    risk: "Moderate risk",
    strategy: "Balanced strategy",
    allocation: [
      { name: "Lending strategies", percentage: 50 },
      { name: "Growth strategies", percentage: 30 },
      { name: "Liquid reserves", percentage: 20 },
    ],
    icon: Scale,
  },
  {
    name: "High",
    roundup: "$10",
    title: "Higher growth potential",
    description: "Pursue growth while accepting greater risk.",
    risk: "Higher risk",
    strategy: "Growth focused",
    allocation: [
      { name: "Growth strategies", percentage: 60 },
      { name: "Lending strategies", percentage: 25 },
      { name: "Liquid reserves", percentage: 15 },
    ],
    icon: TrendingUp,
  },
];

const Jars = () => {
  const [activeJar, setActiveJar] = useState("Low");

  const jar = jars.find((item) => item.name === activeJar)!;
  const JarIcon = jar.icon;

  // Replace these placeholders with actual API/on-chain values.
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
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden rounded-2xl bg-[#f7f7f7] p-4 xl:p-5">
      {/* Compact header */}
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Jars</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your savings strategy.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-xl bg-white px-4 py-3 sm:flex">
          <Wallet size={18} className="text-gray-500" />
          <span className="text-sm text-gray-600">USDC Savings</span>
        </div>
      </div>

      {/* Jar tabs */}
      <div className="flex w-fit shrink-0 items-center gap-1 rounded-xl bg-white p-1">
        {jars.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActiveJar(item.name)}
            aria-pressed={activeJar === item.name}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
              activeJar === item.name
                ? "bg-black text-white shadow"
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Jar overview */}
      <section className="shrink-0 rounded-2xl bg-white p-4 xl:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <JarIcon size={25} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">{jar.name} Jar</h2>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                  {jar.risk}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-700">
                {jar.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">{jar.description}</p>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 px-5 py-3">
            <p className="text-xs text-gray-500">Roundup increment</p>
            <p className="mt-1 text-2xl font-semibold">{jar.roundup}</p>
            <p className="text-xs text-gray-500">Per payment</p>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="shrink-0">
        <h2 className="mb-3 text-base font-semibold">Your {jar.name} Jar</h2>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            icon={<Wallet size={18} />}
            label="Total deposited"
            value={formatUsd(stats.deposited)}
            description="Your contributions"
          />
          <StatCard
            icon={<CircleDollarSign size={18} />}
            label="Current balance"
            value={formatUsd(stats.balance)}
            description="Current jar value"
          />
          <StatCard
            icon={<ChartNoAxesCombined size={18} />}
            label="Yield earned / lost"
            value={formatUsd(stats.yield)}
            description="Net performance"
          />
          <StatCard
            icon={<Activity size={18} />}
            label="Completed roundups"
            value={String(stats.roundupCount)}
            description="Successful deposits"
          />
        </div>
      </section>

      {/* Strategy and allocation */}
      <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 xl:p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-2.5">
              <ChartNoAxesCombined size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Investment strategy</h2>
              <p className="text-xs text-gray-500">
                Intended approach for this jar
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Strategy profile</p>
            <p className="mt-1 text-sm font-semibold">{jar.strategy}</p>
          </div>

          <div className="mt-4 space-y-4">
            {jar.allocation.map((item) => (
              <div key={item.name}>
                <div className="mb-1.5 flex justify-between gap-3 text-sm">
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

        {/* Compact note */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 xl:p-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gray-100 p-2.5">
                <Info size={20} />
              </div>
              <div>
                <h2 className="font-semibold">About your jar</h2>
                <p className="text-xs text-gray-500">
                  How your roundup savings work
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Each eligible payment can create a separate roundup deposit. Your
              selected jar determines the roundup increment. Your deposited
              balance and any investment returns should be displayed using
              verified transaction and contract data.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-sm font-medium">Strategy status</p>
            <p className="mt-1 text-sm text-gray-500">
              {jar.name} Jar · Base Sepolia testnet
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              The allocation shown is illustrative, not a live allocation.
              Connect an actual investment strategy before displaying deployed
              funds or yield claims.
            </p>
          </div>
        </div>
      </section>
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
  <div className="rounded-xl bg-white p-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-gray-500">{label}</p>
      <span className="text-gray-500">{icon}</span>
    </div>
    <p className="mt-3 text-xl font-semibold">{value}</p>
    <p className="mt-1 text-xs text-gray-500">{description}</p>
  </div>
);

export default Jars;
