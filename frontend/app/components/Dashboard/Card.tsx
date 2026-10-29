import { ArrowUpRight } from "lucide-react";

interface CardProps {
  title: string;
  stat: string;
  info: string;
}

const Card = ({ title, stat, info }: CardProps) => {
  return (
    <div className="group flex min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:border-gray-200 hover:shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate text-sm font-medium text-gray-500 sm:text-base">
          {title}
        </h3>

        <div className="shrink-0 rounded-full border border-gray-200 p-1.5 text-gray-500 transition-colors group-hover:border-gray-300 group-hover:bg-gray-50 group-hover:text-black">
          <ArrowUpRight size={18} />
        </div>
      </div>

      {/* Main statistic */}
      <div className="mt-5 break-words text-3xl font-semibold tracking-tight text-gray-900 sm:mt-6 sm:text-4xl">
        {stat}
      </div>

      {/* Supporting information */}
      <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">{info}</p>
    </div>
  );
};

export default Card;
