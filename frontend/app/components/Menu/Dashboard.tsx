import { useEffect, useState } from "react";
import { useConnection } from "wagmi";
import Card from "../Dashboard/Card";
import axios from "axios";
import SavingsCard from "../Dashboard/SavingsCard";
import YourJarCard from "../Dashboard/YourJarCard";
import JarAllocationCard from "../Dashboard/JarAllocationCard";
import RecentTxnsCard from "../Dashboard/RecentTxnsCard";

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
    <div className="bg-[#f7f7f7] rounded-2xl p-4 flex flex-col gap-4">
      <div className="text-4xl font-semibold">Dashboard</div>
      <div className="grid grid-cols-4 gap-4">
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
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-3">
              <SavingsCard
                roundups={[
                  { date: "2026-10-25", count: 3 },
                  { date: "2026-10-26", count: 5 },
                  { date: "2026-10-27", count: 2 },
                  { date: "2026-10-28", count: 4 },
                ]}
              />
            </div>
            <div className="bg-white rounded-2xl p-6 flex-1">?</div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="flex-4">
              <RecentTxnsCard />
            </div>
            <div className="flex-1">
              <JarAllocationCard />
            </div>
          </div>
        </div>
        <div>
          <YourJarCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
