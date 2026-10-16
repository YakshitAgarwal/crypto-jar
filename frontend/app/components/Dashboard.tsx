import Card from "./Card";

const Dashboard = () => {
  return (
    <div className="bg-[#f7f7f7] rounded-2xl p-6 flex flex-col gap-8">
      <div className="text-[42px] font-semibold">Dashboard</div>
      <div className="grid grid-cols-4 gap-6">
        <Card title="Preferred Jar" stat="High" info="New user" />
        <Card title="Total Saved" stat="$10" info="New user" />
        <Card title="This Month" stat="$4" info="New user" />
        <Card title="Total Roundups" stat="18" info="New user" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex">
            <div className="bg-white rounded-2xl p-6">Savings</div>
            <div className="bg-white rounded-2xl p-6">?</div>
          </div>
          <div className="flex">
            <div className="bg-white rounded-2xl p-6">Recent Transactions</div>
            <div className="bg-white rounded-2xl p-6">Jar Allocation</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6">Your Jar</div>
      </div>
    </div>
  );
};

export default Dashboard;
