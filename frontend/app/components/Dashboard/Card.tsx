import { ArrowUpRight } from "lucide-react";

interface CardProps {
  title: string;
  stat: string;
  info: string;
}

const Card = ({ title, stat, info }: CardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="text-[26px] font-semibold">{title}</div>
        <div className="border rounded-full">
          <ArrowUpRight size={34} className="p-2 cursor-pointer" />
        </div>
      </div>
      <div className="mt-6 text-[44px] font-semibold">{stat}</div>
      <div className="mt-2 text-[16px]">{info}</div>
    </div>
  );
};

export default Card;
