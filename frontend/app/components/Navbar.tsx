import Link from "next/link";

const Navbar = () => {
  const tabs = [
    { name: "Product", route: "/" },
    { name: "Features", route: "/features" },
    { name: "Pricing", route: "/pricing" },
    { name: "Resources", route: "/resources" },
  ];

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-fit gap-14 p-2 border-3 border-[#d7d7d7] rounded-2xl ">
      <Link href={"/"} className="text-[24px] font-bold pl-4 cursor-pointer">
        CryptoJar
      </Link>

      <ul className="flex items-center gap-6">
        {tabs.map((tab) => (
          <li key={tab.name}>
            <Link
              href={tab.route}
              className="text-[16px] hover:text-gray-500 transition-colors font-[550]"
            >
              {tab.name}
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <Link
          href={"/dashboard"}
          className="bg-[#080808] text-white px-5 py-3 rounded-xl text-[18px] cursor-pointer"
        >
          Open App
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
