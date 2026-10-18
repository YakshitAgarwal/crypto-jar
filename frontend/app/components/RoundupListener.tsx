"use client";

import { useCallback } from "react";
import { useRoundupSocket } from "../hooks/useRoundupSocket";

type Roundup = {
  transactionId: string;
  txHash: string;
  txAmount: number;
  roundupAmount: number;
  vaultType: string;
  chainId: number;
};

export default function RoundupListener() {
  const handleRoundup = useCallback((roundup: Roundup) => {
    console.log("New roundup received:", roundup);

    // Next: trigger a notification or open your deposit flow.
    // roundup.roundupAmount
    // roundup.vaultType
    // roundup.transactionId
  }, []);

  useRoundupSocket(handleRoundup);

  // This component doesn't render anything.
  return null;
}
