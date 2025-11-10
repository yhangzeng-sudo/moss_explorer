"use client";
import { useState } from "react";

export default function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClick = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-md bg-white/20 text-white font-medium hover:bg-white/30 transition backdrop-blur-sm border border-white/30"
    >
      {isLoggedIn ? "Log Out" : "Log In"}
    </button>
  );
}

