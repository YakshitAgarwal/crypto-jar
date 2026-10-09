interface MenuProps {
  heading: string;
  subheadings: { name: string; icon: React.ReactNode }[];
}

const Menu = ({ heading, subheadings }: MenuProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] text-gray-500">{heading}</h2>

      <div className="flex flex-col gap-2">
        {subheadings.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-gray-500 text-[28px]"
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
