"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useConnection } from "wagmi";
import {
  Search,
  Wallet,
  PiggyBank,
  ArrowLeftRight,
  Filter,
  ChevronRight,
  ChevronLeft,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { normalizeTransfer } from "../../hooks/transactionHistory";

import SummaryCard from "../Transactions/SummaryCard";
import TransactionRow from "../Transactions/TransactionRow";

type TransactionType = "VAULT_DEPOSIT" | "PAYMENT" | "TRANSFER";
type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";
type TabType = "ALL" | "VAULT" | "OTHER";
type Direction = "IN" | "OUT";

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
  direction: Direction;
}

interface AlchemyTransfer {
  uniqueId?: string;
  hash: string;
  from?: string;
  to?: string;
  category?: string;
  asset?: string | null;
  value?: number | null;
  rawContract?: {
    value?: string | null;
    address?: string | null;
    decimal?: string | null;
  };
  metadata?: {
    blockTimestamp?: string | null;
  };
}

interface HistoryResponse {
  data: {
    address: string;
    transfers: AlchemyTransfer[];
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const PAGE_SIZE = 7;

const tabs: { label: string; value: TabType }[] = [
  { label: "All Transactions", value: "ALL" },
  { label: "Vault Deposits", value: "VAULT" },
  { label: "Other Transactions", value: "OTHER" },
];

const Transactions = () => {
  const { address } = useConnection();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTransactions = async (
    walletAddress: string,
    signal?: AbortSignal,
  ) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<HistoryResponse>(
        `${API_BASE_URL}/api/transactions/history`,
        {
          params: { address: walletAddress },
          signal,
        },
      );

      const transfers = response.data.data?.transfers;

      if (!Array.isArray(transfers)) {
        throw new Error("Unexpected transaction history response.");
      }

      const normalized = transfers
        .filter((transfer) => Boolean(transfer.hash))
        .map((transfer, index) =>
          normalizeTransfer(transfer, walletAddress, index),
        )
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

      setTransactions(normalized);
      setCurrentPage(0);
    } catch (err) {
      if (axios.isCancel(err) || signal?.aborted) return;

      console.error("Failed to fetch transaction history:", err);
      setError(
        "Could not load transaction history. Check your backend connection and try again.",
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      setLoading(false);
      setError("");
      setCurrentPage(0);
      return;
    }

    const controller = new AbortController();

    void loadTransactions(address, controller.signal);

    return () => controller.abort();
  }, [address]);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((tx) => {
        const matchesTab =
          activeTab === "ALL" ||
          (activeTab === "VAULT" && tx.type === "VAULT_DEPOSIT") ||
          (activeTab === "OTHER" && tx.type !== "VAULT_DEPOSIT");

        const matchesStatus =
          statusFilter === "ALL" || tx.status === statusFilter;

        const query = search.toLowerCase().trim();

        const matchesSearch =
          tx.description.toLowerCase().includes(query) ||
          tx.hash.toLowerCase().includes(query) ||
          tx.type.toLowerCase().includes(query) ||
          tx.token.toLowerCase().includes(query) ||
          tx.jar?.toLowerCase().includes(query) ||
          tx.address?.toLowerCase().includes(query);

        return matchesTab && matchesStatus && matchesSearch;
      }),
    [transactions, activeTab, search, statusFilter],
  );

  const completedVaultDeposits = transactions.filter(
    (tx) => tx.type === "VAULT_DEPOSIT" && tx.status === "COMPLETED",
  );

  const totalDeposited = completedVaultDeposits.reduce(
    (sum, tx) => sum + tx.amount,
    0,
  );

  const roundupCount = transactions.filter(
    (tx) => tx.type === "VAULT_DEPOSIT",
  ).length;

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);

  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  const visibleTransactions = filteredTransactions.slice(
    safePage * PAGE_SIZE,
    (safePage + 1) * PAGE_SIZE,
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setActiveTab("ALL");
    setCurrentPage(0);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-2xl bg-[#f7f7f7] p-4">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold">Transactions</h1>
          <p className="mt-1 text-xs text-gray-500 xl:text-sm">
            Track wallet transfers and vault deposits.
          </p>
        </div>

        {address && (
          <button
            type="button"
            disabled={loading}
            onClick={() => void loadTransactions(address)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid shrink-0 grid-cols-3 gap-3">
        <SummaryCard
          icon={<ArrowLeftRight size={17} />}
          label="Transfers"
          value={String(transactions.length)}
        />
        <SummaryCard
          icon={<PiggyBank size={17} />}
          label="Vault deposits"
          value={`$${totalDeposited.toFixed(2)}`}
        />
        <SummaryCard
          icon={<Wallet size={17} />}
          label="Roundup transactions"
          value={String(roundupCount)}
        />
      </div>

      {/* Filters */}
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
              onChange={(event) => {
                setSearch(event.target.value);
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
              onChange={(event) => {
                setStatusFilter(event.target.value);
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

      {/* Transaction list */}
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
          {!address ? (
            <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
              <Wallet size={26} className="text-gray-400" />
              <h3 className="mt-3 text-sm font-semibold">
                Connect your wallet
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Connect a wallet to view its Base Sepolia transfer history.
              </p>
            </div>
          ) : loading && transactions.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-4 py-10">
              <LoaderCircle size={26} className="animate-spin text-gray-400" />
              <p className="mt-3 text-sm text-gray-500">
                Loading transaction history...
              </p>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => void loadTransactions(address)}
                className="mt-3 rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium hover:bg-gray-50"
              >
                Try again
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
              <Search size={22} className="text-gray-400" />
              <h3 className="mt-3 text-sm font-semibold">
                No transactions found
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                No transfers match your current filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-xs font-medium underline underline-offset-4"
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

        {/* Pagination */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-4 py-2">
          <p className="text-xs text-gray-500">
            {filteredTransactions.length === 0
              ? "No transactions"
              : `${safePage * PAGE_SIZE + 1}–${Math.min(
                  (safePage + 1) * PAGE_SIZE,
                  filteredTransactions.length,
                )} of ${filteredTransactions.length}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
              disabled={safePage === 0}
              aria-label="Previous transactions"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="min-w-12 text-center text-xs font-medium text-gray-600">
              {totalPages === 0 ? 0 : safePage + 1} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(Math.max(0, totalPages - 1), page + 1),
                )
              }
              disabled={safePage >= totalPages - 1}
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
