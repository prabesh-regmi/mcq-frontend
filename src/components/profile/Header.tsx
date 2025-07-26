"use client";

import React from "react";
import ThemeToggleButton from "../ui/theme-toggle-btn";
import BackButton from "../ui/back-button";

export const Header = () => {
  return (
    <header className="w-full max-w-3xl mx-auto h-16 border-b bg-background flex items-center px-4 lg:px-6 justify-between sticky top-0 z-10">
      <div className="flex gap-2 lg:gap-4">
        <BackButton />
        <h1 className="text-md font-semibold">My Profile</h1>
      </div>
      <ThemeToggleButton />
    </header>
  );
};
