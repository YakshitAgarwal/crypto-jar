import {
  BadgeDollarSign,
  CreditCardCheck,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  PillBottle,
  Settings,
} from "lucide-react";
import Menu from "./Menu";

interface MenubarProps {
  tab: string;
  setTab: (tab: string) => void;
}

const Menubar = ({ tab, setTab }: MenubarProps) => {
  return (
    <div className="bg-[#f7f7f7] p-6 rounded-2xl h-full w-full flex flex-col gap-16">
      <div className="text-[32px] font-semibold">CryptoJar</div>
      <div>
        <Menu
          heading="MENU"
          subheadings={[
            { name: "Dashboard", icon: <LayoutDashboard /> },
            { name: "Jars", icon: <PillBottle /> },
            { name: "Transactions", icon: <CreditCardCheck /> },
            { name: "Invest", icon: <BadgeDollarSign /> },
          ]}
          tab={tab}
          setTab={setTab}
        />
      </div>
      <div>
        <Menu
          heading="GENERAL"
          subheadings={[
            { name: "Settings", icon: <Settings /> },
            { name: "Help", icon: <LifeBuoy /> },
            { name: "Logout", icon: <LogOut /> },
          ]}
          tab={tab}
          setTab={setTab}
        />
      </div>
    </div>
  );
};

export default Menubar;
