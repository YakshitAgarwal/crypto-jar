"use client";

import { useState } from "react";
import UserForm from "../components/UserForm";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(true);

  const handleFormSubmit = () => {
    setShowForm(false);
  };
  return (
    <div className="relative min-h-screen bg-white text-black">
      <div className="p-10">
        <h1 className="text-4xl font-semibold">Dashboard</h1>

        <div className="mt-10 grid grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6">
            <p className="text-sm text-gray-500">$1 Jar</p>
            <h2 className="mt-2 text-2xl font-semibold">$0.00</h2>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-sm text-gray-500">$5 Jar</p>
            <h2 className="mt-2 text-2xl font-semibold">$0.00</h2>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-sm text-gray-500">$10 Jar</p>
            <h2 className="mt-2 text-2xl font-semibold">$0.00</h2>
          </div>
        </div>
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

export default Dashboard;
