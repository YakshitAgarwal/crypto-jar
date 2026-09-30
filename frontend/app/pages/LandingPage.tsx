import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col justify-center items-center">
      <div>Image</div>
      <div className="flex flex-col justify-center items-center text-[#070707] font-semibold text-[88px] leading-[1.05]">
        <p>Turn everyday payments</p>
        <p>into savings</p>
      </div>
      <div className="flex flex-col justify-center items-center text-[#9fa0a4] mt-6 text-[24px]">
        <p>Automatically round up your crypto payments</p>
        <p>and grow your savings with every transaction</p>
      </div>
      <div className="bg-[#fe5d39] py-4 px-10 text-white text-[22px] mt-10 rounded-2xl cursor-pointer">
        <Link href={"/dashboard"}>Try CryptoJar</Link>
      </div>
    </div>
  );
};

export default LandingPage;
