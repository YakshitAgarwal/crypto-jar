import { Search } from "lucide-react";
import { useConnection } from "wagmi";

interface SearchbarProps {
  name: string;
}

const Searchbar = ({ name }: SearchbarProps) => {
  const { address } = useConnection();

  const trimmedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Not connected";

  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] py-5 px-8">
      <div className="relative w-full max-w-md">
        <Search
          size={28}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-4xl bg-white py-4 pl-14 pr-4 outline-none text-[20px]"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-gray-500 p-7 rounded-full"></div>

        <div className="flex flex-col">
          <div className="text-[22px] font-semibold">{name}</div>
          <div className="text-[18px] text-gray-500">{trimmedAddress}</div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
