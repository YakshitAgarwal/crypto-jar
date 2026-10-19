"use client";

import { useCallback, useRef } from "react";
import {
  useWriteContract,
  usePublicClient,
  useChainId,
  useConnection,
} from "wagmi";
import { baseSepolia } from "viem/chains";
import { parseUnits } from "viem";
import { useRoundupSocket } from "../hooks/useRoundupSocket";
import {
  VAULT_ADDRESS,
  VAULT_ABI,
  USDC_ADDRESS,
  USDC_ABI,
} from "../lib/cryptoJar";
import type { Roundup } from "../types/roundup";
import axios from "axios";

const vaultNumbers: Record<Roundup["vaultType"], number> = {
  LOW_RISK: 1,
  MEDIUM_RISK: 2,
  HIGH_RISK: 3,
};

export default function RoundupListener() {
  const { address, isConnected } = useConnection();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { mutateAsync } = useWriteContract();

  // Prevent duplicate processing during this component's lifetime.
  const processingIds = useRef(new Set<string>());

  const handleRoundup = useCallback(
    async (roundup: Roundup) => {
      if (!isConnected || !address) {
        console.warn("Connect your wallet before making a roundup deposit.");
        return;
      }

      if (chainId !== baseSepolia.id || roundup.chainId !== baseSepolia.id) {
        console.warn("Roundup deposits require Base Sepolia.");
        return;
      }

      if (!publicClient) {
        console.warn("Public client is unavailable.");
        return;
      }

      if (!VAULT_ADDRESS || !/^0x[a-fA-F0-9]{40}$/.test(VAULT_ADDRESS)) {
        console.error("Invalid or missing vault address.");
        return;
      }

      if (
        !Number.isFinite(roundup.roundupAmount) ||
        roundup.roundupAmount <= 0
      ) {
        console.warn("Invalid roundup amount.");
        return;
      }

      if (processingIds.current.has(roundup.transactionId)) {
        return;
      }

      const vaultNumber = vaultNumbers[roundup.vaultType];

      if (!vaultNumber) {
        console.error("Unknown vault type:", roundup.vaultType);
        return;
      }

      processingIds.current.add(roundup.transactionId);

      let depositConfirmed = false;

      try {
        // USDC has 6 decimal places.
        const amount = parseUnits(roundup.roundupAmount.toFixed(2), 6);

        // 1. Check how much USDC the vault can spend.
        const currentAllowance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: "allowance",
          args: [address, VAULT_ADDRESS],
        });

        // 2. Request approval only when needed.
        if (currentAllowance < amount) {
          console.log("Requesting USDC approval...");

          const approvalHash = await mutateAsync({
            address: USDC_ADDRESS,
            abi: USDC_ABI,
            functionName: "approve",
            args: [VAULT_ADDRESS, amount],
            chainId: baseSepolia.id,
          });

          const approvalReceipt = await publicClient.waitForTransactionReceipt({
            hash: approvalHash,
          });

          if (approvalReceipt.status !== "success") {
            throw new Error("USDC approval transaction failed.");
          }
        }

        // 3. Ask the user to confirm the vault deposit.
        console.log(`Requesting deposit of ${roundup.roundupAmount} USDC`);

        const depositHash = await mutateAsync({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: "deposit",
          args: [amount, vaultNumber],
          chainId: baseSepolia.id,
        });

        console.log("Deposit transaction submitted:", depositHash);

        const tx = await publicClient.getTransaction({
          hash: depositHash,
        });

        console.log("Actual deposit transaction:", {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          chainId: tx.chainId,
        });

        console.log("Expected vault address:", VAULT_ADDRESS);

        // 4. Wait until the deposit is confirmed on-chain.
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: depositHash,
        });

        if (receipt.status !== "success") {
          throw new Error("Vault deposit transaction failed.");
        }

        depositConfirmed = true;

        console.log("Deposit confirmed:", depositHash);
        console.log("Deposit receipt:", {
          status: receipt.status,
          transactionHash: receipt.transactionHash,
          to: receipt.to,
        });

        // 5. Tell the backend to verify and complete the roundup.
        try {
          const response = await axios.post(
            "http://localhost:8000/api/transactions/complete",
            {
              transactionId: roundup.transactionId,
              roundupTxHash: depositHash,
            },
          );

          console.log("Backend completion:", response.data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Backend status:", error.response?.status);
            console.error("Backend error details:", error.response?.data);
          }

          throw error;
        }

        console.log("Roundup completed successfully.");
      } catch (error) {
        console.error("Roundup processing failed:", error);

        if (depositConfirmed) {
          // The on-chain deposit succeeded. Do not prompt for another
          // deposit merely because the backend request failed.
          console.error(
            "Deposit is confirmed on-chain, but backend completion failed. " +
              "Reconcile this transaction before retrying.",
          );
        } else {
          // The deposit was not confirmed. Allow a later retry.
          processingIds.current.delete(roundup.transactionId);
        }
      }
    },
    [address, isConnected, chainId, publicClient, mutateAsync],
  );

  useRoundupSocket(handleRoundup);

  return null;
}
