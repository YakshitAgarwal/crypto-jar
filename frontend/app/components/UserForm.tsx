"use client";

import axios from "axios";
import { useState } from "react";
import { useConnection } from "wagmi";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

interface UserFormProps {
  onSubmit: () => void;
}

const UserForm = ({ onSubmit }: UserFormProps) => {
  const [risk, setRisk] = useState<RiskLevel>("MEDIUM");
  const { address, isConnected } = useConnection();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConnected || !address) {
      console.error("Wallet not connected");
      return;
    }

    const form = new FormData(e.currentTarget);

    const userData = {
      address: address,
      name: form.get("name") as string,
      email: form.get("email") as string,
      riskPreference: risk,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/register",
        userData,
      );
      console.log("User registered:", data);

      onSubmit();
    } catch (error) {
      console.log("Registration failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-black">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="mb-2 text-[18px] text-gray-500">
            Welcome to Crypto Jar
          </p>

          <h1 className="text-[34px] font-semibold tracking-tight">
            Let&apos;s set up your jar.
          </h1>

          <p className="mt-3 text-[18px] leading-6 text-gray-500">
            Tell us a little about yourself and choose how aggressively you want
            to save.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[18px] font-medium"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[18px] outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[18px] font-medium"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[18px] outline-none transition focus:border-black"
            />
          </div>

          <div>
            <p className="mb-3 text-[18px] font-medium">
              Choose your risk preference
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setRisk("LOW")}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  risk === "LOW"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">$1 Jar</span>
                  <span className="text-xs">Low Risk</span>
                </div>

                <p
                  className={`mt-1 text-xs ${
                    risk === "LOW" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Conservative savings strategy
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRisk("MEDIUM")}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  risk === "MEDIUM"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">$5 Jar</span>
                  <span className="text-xs">Medium Risk</span>
                </div>

                <p
                  className={`mt-1 text-xs ${
                    risk === "MEDIUM" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Balanced savings and growth
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRisk("HIGH")}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  risk === "HIGH"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">$10 Jar</span>
                  <span className="text-xs">High Risk</span>
                </div>

                <p
                  className={`mt-1 text-xs ${
                    risk === "HIGH" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Higher growth potential
                </p>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl mt-4 bg-black py-3.5 text-[18px] cursor-pointer font-medium text-white transition hover:bg-gray-800"
          >
            Continue to Crypto Jar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
