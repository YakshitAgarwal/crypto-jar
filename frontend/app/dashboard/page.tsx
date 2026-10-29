"use client";

import { useState, useEffect } from "react";
import { useConnection } from "wagmi";
import UserForm from "../components/UserForm";
import axios from "axios";
import Menubar from "../components/Menubar";
import Searchbar from "../components/Searchbar";
import Dashboard from "../components/Menu/Dashboard";
import Jars from "../components/Menu/Jars";
import Transactions from "../components/Menu/Transactions";
import Invest from "../components/Menu/Invest";
import Settings from "../components/Menu/Settings";
import Help from "../components/Menu/Help";
import Logout from "../components/Menu/Logout";
import RoundupListener from "../components/RoundupListener";
import Withdraw from "../components/Menu/Withdraw";

const DashboardPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("Dashboard");

  const { address, isConnected } = useConnection();

  useEffect(() => {
    const savedTab = localStorage.getItem("tab");
    if (savedTab) setTab(savedTab);

    const checkUser = async () => {
      if (!address || !isConnected) {
        setShowForm(false);
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:8000/api/users", {
          params: {
            address: address.toLowerCase(),
          },
        });

        setShowForm(!data.exists);
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    const getPendingRoundupTransaction = async () => {
      if (!address || !isConnected) return;

      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/transactions/pending",
          {
            params: {
              address: address.toLowerCase(),
            },
          },
        );

        if (data.exists) {
          console.log(data.transaction);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkUser();
    getPendingRoundupTransaction();
  }, [address, isConnected]);

  const handleFormSubmit = () => {
    setShowForm(false);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-white text-black">
      <RoundupListener />

      {/* Main dashboard layout */}
      <div
        className={`flex h-full min-h-0 gap-4 overflow-hidden p-4 ${
          showForm ? "blur-sm" : ""
        }`}
      >
        {/* Sidebar */}
        <aside className="h-full w-80 shrink-0 overflow-hidden">
          <Menubar tab={tab} setTab={setTab} />
        </aside>

        {/* Main content */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          {/* Top bar stays fixed in the layout */}
          <div className="w-full min-w-0 shrink-0">
            <Searchbar />
          </div>

          {/* Selected page gets the remaining available height */}
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            {tab === "Dashboard" && <Dashboard />}
            {tab === "Jars" && <Jars />}
            {tab === "Transactions" && <Transactions />}
            {tab === "Invest" && <Invest />}
            {tab === "Withdraw" && <Withdraw />}
            {tab === "Settings" && <Settings />}
            {tab === "Help" && <Help />}
            {tab === "Logout" && <Logout />}
          </div>
        </main>
      </div>

      {/* Onboarding modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md" />

          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
              <UserForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
