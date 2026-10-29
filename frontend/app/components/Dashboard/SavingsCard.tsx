"use client";

import { useMemo } from "react";

interface SavingsCardProps {
  roundups?: {
    date: string;
    count: number;
  }[];
}

const SavingsCard = ({ roundups = [] }: SavingsCardProps) => {
  const weekData = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = today.getDay();

    startOfWeek.setDate(today.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      const dateKey = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      const count = roundups
        .filter((item) => item.date.slice(0, 10) === dateKey)
        .reduce((sum, item) => sum + item.count, 0);

      return {
        date,
        day: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
        count,
        isToday: index === day,
      };
    });
  }, [roundups]);

  const maxCount = Math.max(...weekData.map((item) => item.count), 1);

  return (
    <section className="w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-semibold">Savings</h2>

      <div className="mt-6 flex items-end justify-between gap-0">
        {weekData.map((item) => {
          const barHeight =
            item.count === 0 ? 4 : Math.max((item.count / maxCount) * 76, 8);

          return (
            <div
              key={item.date.toISOString()}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              {/* Bar and hover tooltip */}
              <div className="group relative flex h-20 w-full items-end justify-center">
                <div
                  className={`w-5 max-w-full rounded-full transition-all duration-200 sm:w-7 ${
                    item.isToday
                      ? "bg-black"
                      : "bg-emerald-300 hover:bg-emerald-500"
                  }`}
                  style={{ height: `${barHeight}px` }}
                  tabIndex={0}
                  role="img"
                  aria-label={`${item.count} roundup transactions on ${item.date.toLocaleDateString(
                    "en-US",
                    { weekday: "long" },
                  )}`}
                />

                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                  <span className="font-semibold">{item.count}</span> roundup
                  {item.count === 1 ? "" : "s"}
                  <span className="block mt-0.5 text-gray-300">
                    {item.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <span
                className={`mt-2 text-lg ${
                  item.isToday ? "font-semibold text-black" : "text-gray-400"
                }`}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SavingsCard;
