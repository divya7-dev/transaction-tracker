"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { showSuccess, showError ,getLocalData,setLocalData} from "@/app/components/utils";
import { useCookies } from "react-cookie";
import { useAuth } from "../context/DataContext";
import CryptoJS from "crypto-js";

const secretKey = "Suvena";

export default function LoginPage() {
  const [cookies, setCookie] = useCookies(["name"]);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { setUser } = useAuth();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignupRedirect = () => {
    router.push("/signup");
  };
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const users = getLocalData("users") || "[]";
    const matchedUser = users.find((user: any) => {
      try {
        const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        return (
          user.email.trim().toLowerCase() === email.trim().toLowerCase() &&
          decryptedPassword === password
        );
      } catch (error) {
        return false;
      }
    });
    if (matchedUser) {
      setCookie("name", matchedUser.name, { path: "/" });
      const username = matchedUser.name || matchedUser.email;
      setUser({
        name: matchedUser.name,
        username,
        email: matchedUser.email,
      });
      setLocalData("currentUser",matchedUser);
      showSuccess("Logged in successfully!", "login-success");
      setTimeout(() => {
        router.push("/transactions?page=1");
      }, 3000);
    } else {
      showError("User not found or incorrect password", "login-error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm px-10 py-12 bg-white shadow-lg rounded-2xl sm:w-[400px]"
      >
        <h1 className="mb-6 text-3xl font-extrabold text-center">Login</h1>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-base font-bold text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div className="relative mb-5">
          <label
            htmlFor="password"
            className="block text-base font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-[42px] right-3 text-gray-500 hover:text-purple-600"
          >
            {showPassword ? (
              <EyeOff size={20} className="cursor-pointer" />
            ) : (
              <Eye size={20} className="cursor-pointer" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={!email.trim() || !password.trim()}
          className={`text-base font-medium w-full py-2 rounded-lg transition duration-300 ${
            !email.trim() || !password.trim()
              ? "bg-purple-500 text-white cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600 cursor-pointer"
          }`}
        >
          Login
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-gray-600">
            New User?{" "}
            <button
              type="button"
              onClick={handleSignupRedirect}
              className="text-sm font-medium text-purple-600 cursor-pointer hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
