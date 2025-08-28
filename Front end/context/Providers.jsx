"use client";
import { ThemeProvider } from "next-themes";
import React from "react";
import { Toaster } from "react-hot-toast";
import { SSEProvider } from "./SSEContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Toaster position="top-center" reverseOrder={false} />
      <SSEProvider>{children}</SSEProvider>
    </ThemeProvider>
  );
}
