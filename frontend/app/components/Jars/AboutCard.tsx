import { Info } from "lucide-react";

interface AboutCardProps {
  jarName: string;
}

const AboutCard = ({ jarName }: AboutCardProps) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 xl:p-5">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gray-100 p-2.5">
            <Info size={20} />
          </div>
          <div>
            <h2 className="font-semibold">About your jar</h2>
            <p className="text-xs text-gray-500">
              How your roundup savings work
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-gray-600">
          Each eligible payment can create a separate roundup deposit. Your
          selected jar determines the roundup increment. Your deposited balance
          and any investment returns should be displayed using verified
          transaction and contract data.
        </p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="text-sm font-medium">Strategy status</p>
        <p className="mt-1 text-sm text-gray-500">
          {jarName} Jar · Base Sepolia testnet
        </p>
        <p className="mt-2 text-xs leading-5 text-gray-500">
          The allocation shown is illustrative, not a live allocation. Connect
          an actual investment strategy before displaying deployed funds or
          yield claims.
        </p>
      </div>
    </div>
  );
};

export default AboutCard;
