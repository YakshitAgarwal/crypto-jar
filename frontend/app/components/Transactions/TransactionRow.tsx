import { ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";

type TransactionType = "VAULT_DEPOSIT" | "PAYMENT" | "TRANSFER";
type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";

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

const explorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

const TransactionRow = ({ tx }: { tx: Transaction }) => {
  const isVault = tx.type === "VAULT_DEPOSIT";

  const title = isVault
    ? `${tx.jar ?? ""} Jar deposit`.trim()
    : tx.type === "PAYMENT"
      ? "Wallet payment"
      : "Wallet transfer";

  const date = new Date(tx.date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const statusStyle = {
    COMPLETED: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    FAILED: "bg-red-50 text-red-700",
  }[tx.status];

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-3 transition hover:bg-gray-50 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            isVault
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isVault ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold xl:text-sm">{title}</p>
          <p className="mt-1 truncate text-[10px] text-gray-500 xl:text-xs">
            {date} · {tx.description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="text-right">
          <p className="text-xs font-semibold tabular-nums xl:text-sm">
            {isVault ? "+" : "−"}${tx.amount.toFixed(2)}
          </p>
          <p className="mt-0.5 text-[10px] text-gray-500">{tx.token}</p>
        </div>

        <span
          className={`hidden rounded-full px-2 py-1 text-[10px] font-medium sm:inline-block ${statusStyle}`}
        >
          {tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
        </span>

        <a
          href={explorerUrl(tx.hash)}
          target="_blank"
          rel="noopener noreferrer"
          title="View on Base Sepolia Explorer"
          aria-label={`View ${title} on Base Sepolia Explorer`}
          className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-black"
        >
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
};

export default TransactionRow;
