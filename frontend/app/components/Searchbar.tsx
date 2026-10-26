"use client";

import { Search } from "lucide-react";
import { useConnection } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";

const Searchbar = () => {
  const { address, isConnected } = useConnection();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setName("");
      return;
    }

    setMounted(true);

    let cancelled = false;

    const fetchUser = async () => {
      setLoading(true);

      try {
        const response = await axios.get("http://localhost:8000/api/users", {
          params: { address: address.toLowerCase() },
        });

        if (cancelled) return;

        if (response.data.exists) {
          setName(response.data.name || "");
        } else {
          setName("");
        }
      } catch (error) {
        if (!cancelled) {
          setName("");
        }

        console.error("Error fetching user:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchUser();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected]);

  const connected = mounted && isConnected && !!address;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-8 py-3">
      <div className="relative w-full max-w-md">
        <Search
          size={24}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-4xl bg-white py-2 pl-14 pr-4 text-[18px] outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gray-500 p-6" />

        <div className="flex flex-col">
          <div className="text-[20px] font-semibold">
            {loading ? "Loading..." : name}
          </div>

          <div className="text-[16px] text-gray-500">
            {connected ? (
              <div>
                {address!.slice(0, 6)}...{address!.slice(-4)}
              </div>
            ) : (
              <div>{mounted ? "Not connected" : "Loading wallet..."}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
