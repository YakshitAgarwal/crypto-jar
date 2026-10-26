interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const SummaryCard = ({ icon, label, value }: SummaryCardProps) => {
  return (
    <div className="min-w-0 rounded-xl bg-white p-3 xl:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] text-gray-500 xl:text-xs">{label}</p>
        <span className="hidden text-gray-500 sm:block">{icon}</span>
      </div>
      <p className="mt-2 truncate text-lg font-semibold xl:text-xl">{value}</p>
    </div>
  );
};

export default SummaryCard;
