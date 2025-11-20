// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md"; // import the logout icon

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // Redirect to login page after logout
  };

  return (
    <div
      onClick={handleLogout}
      className="w-full h-auto px-4 py-6 absolute lg:relative bottom-0 text-[#2B2B2B] hover:text-[#D68A36] flex items-center gap-1 cursor-pointer"
    >
      <span className="text-[18px] lg:text-[19px]">
        <MdLogout />
      </span>
      <span className="text-[15px] lg:text-[16px]">Log out</span>
    </div>
  );
};

export default LogoutButton;
