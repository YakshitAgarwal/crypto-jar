"use client";

import { useState, useEffect } from "react";
import { useConnection } from "wagmi";
import UserForm from "../components/UserForm";
import axios from "axios";
import Menubar from "../components/Menubar";
import Searchbar from "../components/Searchbar";
import Dashboard from "../components/Dashboard";
import Jars from "../components/Jars";
import Transactions from "../components/Transactions";
import Invest from "../components/Invest";
import Settings from "../components/Settings";
import Help from "../components/Help";
import Logout from "../components/Logout";
import RoundupListener from "../components/RoundupListener";

const DashboardPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("Dashboard");

  const { address, isConnected } = useConnection();

  useEffect(() => {
    const checkUser = async () => {
      if (!address || !isConnected) {
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:8000/api/users", {
          params: {
            address: address?.toLowerCase(),
          },
        });

        if (data.exists) {
          setShowForm(false);
        } else {
          setShowForm(true);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    const getPendingRoundupTransaction = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/transactions/pending",
          {
            params: {
              address: address?.toLowerCase(),
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
    <div className="relative min-h-screen bg-white text-black">
      <RoundupListener />
      <div
        className={`flex min-h-screen gap-4 p-6 ${showForm ? "blur-sm" : ""}`}
      >
        <aside className="w-80 shrink-0 self-stretch">
          <Menubar tab={tab} setTab={setTab} />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="w-full min-w-0">
            <Searchbar />
          </div>
          <div className="min-w-0 flex-1">
            {tab == "Dashboard" && <Dashboard />}
            {tab == "Jars" && <Jars />}
            {tab == "Transactions" && <Transactions />}
            {tab == "Invest" && <Invest />}
            {tab == "Settings" && <Settings />}
            {tab == "Help" && <Help />}
            {tab == "Logout" && <Logout />}
          </div>
        </main>
      </div>

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
