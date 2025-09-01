"use client";
import type { Metadata } from "next";
import "./globals.scss";
import { AuthProvider, TransProvider } from "./context/DataContext";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CookiesProvider } from "react-cookie";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CookiesProvider>
          <AuthProvider>
            <Navbar />

            <TransProvider>{children}</TransProvider>
          </AuthProvider>
        </CookiesProvider>

        <ToastContainer position="top-center" autoClose={3000} />
      </body>
    </html>
  );
}
