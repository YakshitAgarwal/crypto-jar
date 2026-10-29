type Direction = "IN" | "OUT";
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

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS?.toLowerCase();

export function normalizeTransfer(
  transfer: AlchemyTransfer,
  walletAddress: string,
  index: number,
): Transaction {
  const wallet = walletAddress.toLowerCase();
  const from = transfer.from?.toLowerCase() ?? "";
  const to = transfer.to?.toLowerCase() ?? "";

  const direction: Direction = from === wallet ? "OUT" : "IN";
  const isVaultDeposit = to === VAULT_ADDRESS;

  const rawValue = Number(transfer.value ?? 0);
  const amount = Number.isFinite(rawValue) ? rawValue : 0;

  const timestamp = transfer.metadata?.blockTimestamp;

  return {
    id: `${transfer.hash}-${transfer.uniqueId ?? `${transfer.category ?? "transfer"}-${index}`}`,
    hash: transfer.hash,
    type: isVaultDeposit
      ? "VAULT_DEPOSIT"
      : direction === "OUT"
        ? "PAYMENT"
        : "TRANSFER",
    amount,
    token: transfer.asset || "Unknown asset",
    status: "COMPLETED",
    date: timestamp || new Date().toISOString(),
    description: isVaultDeposit
      ? "Vault deposit"
      : direction === "OUT"
        ? `Outgoing ${transfer.category ?? "wallet"} transfer`
        : `Incoming ${transfer.category ?? "wallet"} transfer`,
    address: direction === "OUT" ? transfer.to : transfer.from,
    direction,
  };
}
