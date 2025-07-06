// LoginModal.jsx

import React, { useState } from "react";
import PropTypes from "prop-types";
import { SquareXIcon, EyeIcon, EyeClosedIcon } from "raster-react";

const LoginModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (username === "hacker" && password === "htn2025") {
      localStorage.setItem("isAuthenticated", "true");
      window.location.reload();
    } else {
      alert("Invalid credentials!!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FFF8E8]/40 backdrop-blur-md">
      <div className="relative bg-[#ddd5eb] w-[500px] h-[350px] border-2 border-black shadow-xl">
        {/* Fake Windows UI Bar */}
        <div className="flex justify-between items-center bg-[#ccc3e0] px-4 py-2 border-b-2 border-black">
          <span className="font-bold text-gray-800">Log into your account</span>
          <button onClick={onClose} className="text-black hover:text-[#FFF8E8]">
            <SquareXIcon size={40} strokeWidth={0.25} radius={1} />
          </button>
        </div>

        {/* Login Box */}
        <div className="p-10 flex flex-col items-center">
          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            className="w-3/5 px-3 py-2 mb-3 border-2 border-black rounded-lg bg-white focus:ring-2 focus:ring-[#FBE7C6] focus:outline-none text-left"
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password Input */}
          <div className="w-3/5 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 border-2 border-black rounded-lg bg-white focus:ring-2 focus:ring-[#FBE7C6] focus:outline-none text-left"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeIcon size={25} strokeWidth={0.25} radius={1} />
              ) : (
                <EyeClosedIcon size={25} strokeWidth={0.25} radius={1} />
              )}
            </button>
          </div>

          {/* Forgot Password Button */}
          <button
            onClick={() => alert("Oh no :((")}
            className="text-gray-700 text-sm mt-2 hover:underline"
          >
            Forgot Password?
          </button>

          {/* Login Button */}
          <div className="mt-6">
            <button
              className="w-40 py-2 text-black bg-[#ddd5eb] border-2 border-black 
                relative after:absolute after:inset-0 after:-translate-x-1 
                after:translate-y-1 after:bg-[#FFF8E8] after:border-2 after:border-black
                after:w-full after:h-full after:block hover:after:-translate-x-0 
                hover:after:translate-y-0 transition-all duration-150 mx-auto block"
              onClick={handleLogin}
            >
              <span className="relative z-10">Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoginModal;
