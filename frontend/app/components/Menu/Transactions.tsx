"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Wallet,
  PiggyBank,
  ArrowLeftRight,
  Filter,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import SummaryCard from "../Transactions/SummaryCard";
import TransactionRow from "../Transactions/TransactionRow";

type TransactionType = "VAULT_DEPOSIT" | "PAYMENT" | "TRANSFER";
type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";
type TabType = "ALL" | "VAULT" | "OTHER";

interface Transaction {
  id: string;
  hash: string;
  type: TransactionType;
  amount: number;
  token: string;
  status: TransactionStatus;
  date: string;
  description: string;
  jar?: string;
  address?: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    type: "VAULT_DEPOSIT",
    amount: 2.6,
    token: "USDC",
    status: "COMPLETED",
    date: "2026-10-24T14:30:00Z",
    description: "Roundup deposit",
    jar: "Medium",
  },
  {
    id: "2",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    type: "PAYMENT",
    amount: 17.4,
    token: "USDC",
    status: "COMPLETED",
    date: "2026-10-24T14:28:00Z",
    description: "Wallet payment",
    address: "0x1234...5678",
  },
  {
    id: "3",
    hash: "0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",
    type: "VAULT_DEPOSIT",
    amount: 4.25,
    token: "USDC",
    status: "PENDING",
    date: "2026-10-23T10:15:00Z",
    description: "Roundup deposit",
    jar: "Low",
  },
  {
    id: "4",
    hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    type: "TRANSFER",
    amount: 25,
    token: "USDC",
    status: "COMPLETED",
    date: "2026-10-22T09:00:00Z",
    description: "Wallet transfer",
    address: "0xabcd...1234",
  },
  {
    id: "5",
    hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    type: "TRANSFER",
    amount: 25,
    token: "USDC",
    status: "COMPLETED",
    date: "2026-10-22T09:00:00Z",
    description: "Wallet transfer",
    address: "0xabcd...1234",
  },
  {
    id: "6",
    hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    type: "TRANSFER",
    amount: 25,
    token: "USDC",
    status: "COMPLETED",
    date: "2026-10-22T09:00:00Z",
    description: "Wallet transfer",
    address: "0xabcd...1234",
  },
  {
    id: "7",
    hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    type: "TRANSFER",
    amount: 25,
    token: "USDC",
    status: "COMPLETED",
    date: "2026-10-22T09:00:00Z",
    description: "Wallet transfer",
    address: "0xabcd...1234",
  },
];

const tabs: { label: string; value: TabType }[] = [
  { label: "All Transactions", value: "ALL" },
  { label: "Vault Deposits", value: "VAULT" },
  { label: "Other Transactions", value: "OTHER" },
];

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);

  const PAGE_SIZE = 7;

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((tx) => {
        const matchesTab =
          activeTab === "ALL" ||
          (activeTab === "VAULT" && tx.type === "VAULT_DEPOSIT") ||
          (activeTab === "OTHER" && tx.type !== "VAULT_DEPOSIT");

        const matchesStatus =
          statusFilter === "ALL" || tx.status === statusFilter;

        const query = search.toLowerCase();
        const matchesSearch =
          tx.description.toLowerCase().includes(query) ||
          tx.hash.toLowerCase().includes(query) ||
          tx.type.toLowerCase().includes(query) ||
          tx.jar?.toLowerCase().includes(query) ||
          tx.address?.toLowerCase().includes(query);

        return matchesTab && matchesStatus && matchesSearch;
      }),
    [activeTab, search, statusFilter],
  );

  const completedVaultDeposits = transactions.filter(
    (tx) => tx.type === "VAULT_DEPOSIT" && tx.status === "COMPLETED",
  );

  const totalDeposited = completedVaultDeposits.reduce(
    (sum, tx) => sum + tx.amount,
    0,
  );

  const completedCount = transactions.filter(
    (tx) => tx.status === "COMPLETED",
  ).length;

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);

  const visibleTransactions = filteredTransactions.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-2xl bg-[#f7f7f7] p-4">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-4xl">Transactions</h1>
          <p className="mt-1 text-xs text-gray-500 xl:text-sm">
            Track payments and roundup deposits.
          </p>
        </div>
      </div>
      <div className="grid shrink-0 grid-cols-3 gap-3">
        <SummaryCard
          icon={<ArrowLeftRight size={17} />}
          label="Transactions"
          value={String(transactions.length)}
        />
        <SummaryCard
          icon={<PiggyBank size={17} />}
          label="Vault deposits"
          value={`$${totalDeposited.toFixed(2)}`}
        />
        <SummaryCard
          icon={<Wallet size={17} />}
          label="Completed"
          value={String(completedCount)}
        />
      </div>
      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex w-full gap-1 overflow-x-auto rounded-xl bg-white p-1 sm:w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(0);
              }}
              aria-pressed={activeTab === tab.value}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition xl:px-4 xl:text-sm ${
                activeTab === tab.value
                  ? "bg-black text-white shadow"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-gray-400 xl:text-sm"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5">
            <Filter size={15} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(0);
              }}
              aria-label="Filter by transaction status"
              className="max-w-28 bg-transparent py-2.5 text-xs outline-none xl:text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold">
            {tabs.find((tab) => tab.value === activeTab)?.label}
          </h2>
          <span className="text-xs text-gray-500">
            {filteredTransactions.length} results
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-10 text-center">
              <Search size={22} className="text-gray-400" />
              <h3 className="mt-3 text-sm font-semibold">
                No transactions found
              </h3>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setCurrentPage(0);
                }}
                className="mt-2 text-xs font-medium underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {visibleTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-4 py-2">
          <p className="text-xs text-gray-500">
            {filteredTransactions.length === 0
              ? "No transactions"
              : `${currentPage * PAGE_SIZE + 1}–${Math.min(
                  (currentPage + 1) * PAGE_SIZE,
                  filteredTransactions.length,
                )} of ${filteredTransactions.length}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
              disabled={currentPage === 0}
              aria-label="Previous transactions"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-12 text-center text-xs font-medium text-gray-600">
              {totalPages === 0 ? 0 : currentPage + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages - 1, page + 1))
              }
              disabled={currentPage >= totalPages - 1}
              aria-label="Next transactions"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
