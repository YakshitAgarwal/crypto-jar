"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

interface ConnectWalletProps {
  text: string;
  className: string;
}

const ConnectWallet = ({ text, className }: ConnectWalletProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const connectWallet = async () => {
    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("Please install a wallet such as MetaMask.");
        return;
      }

      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      const [account] = await walletClient.requestAddresses();

      setAddress(account);

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={connectWallet} disabled={loading} className={className}>
      {/* {loading
        ? "Connecting..."
        : address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : text} */}
      {text}
    </button>
  );
};

export default ConnectWallet;
