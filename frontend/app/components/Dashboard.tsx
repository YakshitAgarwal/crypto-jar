import { useEffect, useState } from "react";
import { useConnection } from "wagmi";
import Card from "./Card";
import axios from "axios";
import SavingsCard from "./SavingsCard";

interface DashboardStats {
  preferredJar: string;
  totalAmountSaved: number;
  totalRoundups: number;
  amountSavedThisMonth: number;
}

const Dashboard = () => {
  const { address } = useConnection();

  const [stats, setStats] = useState<DashboardStats>({
    preferredJar: "",
    totalAmountSaved: 0,
    totalRoundups: 0,
    amountSavedThisMonth: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchUserDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/details",
          {
            params: { address: address.toLowerCase() },
          },
        );

        if (!cancelled) {
          // Backend response: { message, data: { preferredJar, ... } }
          setStats(response.data.data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching user details:", error);

          if (axios.isAxiosError(error)) {
            setError(
              error.response?.data?.message ||
                "Failed to fetch dashboard details.",
            );
          } else {
            setError("An unexpected error occurred.");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();

    return () => {
      cancelled = true;
    };
  }, [address]);

  const formatAmount = (amount: number) =>
    `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const jarDescriptions: Record<string, string> = {
    LOW: "Conservative savings strategy",
    MEDIUM: "Balanced savings and growth",
    HIGH: "Higher growth potential",
  };

  const preferredJar = stats.preferredJar
    ? stats.preferredJar.charAt(0) + stats.preferredJar.slice(1).toLowerCase()
    : "—";

  const jarDescription =
    jarDescriptions[stats.preferredJar] ?? "Your savings strategy";

  return (
    <div className="bg-[#f7f7f7] rounded-2xl p-6 flex flex-col gap-8">
      <div className="text-[42px] font-semibold">Dashboard</div>
      <div className="grid grid-cols-4 gap-6">
        <Card
          title="Preferred Jar"
          stat={loading ? "..." : preferredJar}
          info={jarDescription}
        />
        <Card
          title="Total Saved"
          stat={loading ? "..." : formatAmount(stats.totalAmountSaved)}
          info="Great"
        />
        <Card
          title="This Month"
          stat={loading ? "..." : formatAmount(stats.amountSavedThisMonth)}
          info="Saved this calendar month"
        />
        <Card
          title="Total Roundups"
          stat={loading ? "..." : String(stats.totalRoundups)}
          info="Successfully completed"
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex">
            <SavingsCard />
            <div className="bg-white rounded-2xl p-6">?</div>
          </div>
          <div className="flex">
            <div className="bg-white rounded-2xl p-6">Recent Transactions</div>
            <div className="bg-white rounded-2xl p-6">Jar Allocation</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6">Your Jar</div>
      </div>
    </div>
  );
};

export default Dashboard;
