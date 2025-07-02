import React from "react";
import Login from "@/components/frontend/Login";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col min-h-screen">
      <h2 className="text-4xl">Welcome to Detect Traffic Violation Website </h2>
      <div>
        <Login />
      </div>
    </div>
  );
}
