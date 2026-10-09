"use client";

import { useState, useEffect } from "react";
import { useConnection } from "wagmi";
import UserForm from "../components/UserForm";
import axios from "axios";
import Menubar from "../components/Menubar";
import Searchbar from "../components/Searchbar";
import Dashboard from "../components/Dashboard";

const DashboardPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  const { address, isConnected } = useConnection();

  useEffect(() => {
    const checkUser = async () => {
      if (!address || !isConnected) {
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:8000/api/users", {
          params: {
            address,
          },
        });

        if (data.exists) {
          setShowForm(false);
          setName(data.name);
        } else {
          setShowForm(true);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();
  }, [address, isConnected]);

  const handleFormSubmit = () => {
    setShowForm(false);
  };

  return (
    <div className="relative min-h-screen bg-white text-black">
      <div
        className={`flex min-h-screen gap-4 p-6 ${showForm ? "blur-sm" : ""}`}
      >
        <aside className="w-72 shrink-0 self-stretch">
          <Menubar />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="w-full min-w-0">
            <Searchbar name={name} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-semibold">
              <Dashboard />
            </h1>
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
