"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { showSuccess, showError,setLocalData,getLocalData } from "../components/utils";

import CryptoJS from "crypto-js";

const secretKey = "Suvena";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const togglePassword = () => setShowPassword((prev) => !prev);
  const isFormFilled =
    name.trim() && email.trim() && password.trim() && confirmPassword.trim();
  const isFormInvalid = !isFormFilled;
  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      showError("Please fill in all fields", "validation");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match", "validation");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email", "validation");
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      showError("Password must contain at least 1 number, 1 uppercase, 1 lowercase, and be 8+ characters","validation")
      return;
    }

   
    const existingUsers = getLocalData("users") || "[]";

    if (existingUsers.some((user: any) => user.name === name)) {
      showError("Username already exists", "validation");
      return;
    }

    if (existingUsers.some((user: any) => user.email === email)) {
      showError("Email already exists","validation")
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      secretKey
    ).toString();
    const newUser = { name, email, password: encryptedPassword };
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    showSuccess("Signup successful!","validation")
    

    // Reset form fields
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm px-10 py-12 bg-white shadow-lg rounded-2xl"
      >
        <h1 className="mb-6 text-3xl font-extrabold text-center">Signup</h1>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-base font-bold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-base font-bold text-gray-700">
            Email
          </label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative mb-5">
          <div className="flex items-center justify-between">
            <label className="block text-base font-bold text-gray-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                if (!toast.isActive("password-info")) {
                  toast.info(
                    "Password must include: 1 number, 1 uppercase, 1 lowercase, and 8+ characters",
                    {
                      position: "top-center",
                      autoClose: 4000,
                      toastId: "password-info",
                    }
                  );
                }
              }}
              className="mr-2 text-gray-500 cursor-pointer hover:text-purple-600"
            >
              <Info size={18} />
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-[42px] right-3 text-gray-500 hover:text-purple-600 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-3">
          <label className="block text-base font-bold text-gray-700">
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-[42px] right-3 text-gray-500 hover:text-purple-600 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isFormInvalid}
          className={`w-full py-2 rounded-lg transition duration-300 text-base font-medium ${
            isFormInvalid
              ? "bg-purple-500 text-white cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600 cursor-pointer"
          }`}
        >
          Sign up
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-gray-600">
            Already a User?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm font-medium text-purple-600 cursor-pointer hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
