export type Roundup = {
  transactionId: string;
  txHash: `0x${string}`;
  txAmount: number;
  roundupAmount: number;
  vaultType: "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK";
  chainId: number;
};
