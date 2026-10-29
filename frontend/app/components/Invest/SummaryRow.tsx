interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

const SummaryRow = ({ label, value, bold = false }: SummaryRowProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-right text-sm ${
          bold ? "font-semibold text-gray-900" : "font-medium text-gray-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default SummaryRow;
