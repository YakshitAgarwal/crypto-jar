"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useConnection } from "wagmi";
import { Roundup } from "../types/roundup";

export function useRoundupSocket(onRoundup: (roundup: Roundup) => void) {
  const { address, isConnected } = useConnection();

  useEffect(() => {
    if (!isConnected || !address) return;

    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      socket.emit("register-wallet", address);
    });

    socket.on("roundup:pending", onRoundup);

    return () => {
      socket.disconnect();
    };
  }, [address, isConnected, onRoundup]);
}
