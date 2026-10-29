interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

const StatCard = ({ icon, label, value, description }: StatCardProps) => {
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-gray-500">{label}</p>
        <span className="text-gray-500">{icon}</span>
      </div>
      <p className="mt-3 text-xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default StatCard;
