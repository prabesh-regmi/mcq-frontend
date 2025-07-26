import { Header } from "@/components/profile/Header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="w-full p-4 max-w-3xl mx-auto space-y-6">{children}</main>
    </div>
  );
};

export default layout;
