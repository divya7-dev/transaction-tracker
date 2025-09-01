import React from "react";
import { HandCoins } from "lucide-react";
export default function Navbar() {
  return (
    <>
      <div className="relative top-0 z-50 flex items-center bg-purple-500">
        <h1 className="p-4 pl-12 text-2xl font-bold text-white cursor-pointer ">
          Spendora
        </h1>
        <HandCoins
          size={24}
          color="white"
          className="cursor-pointer "
        />
        <div className="bg-re"></div>
      </div>
    </>
  );
}
