"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggleButton = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();
  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setTheme((prev) => (prev === "light" ? "dark" : "light"));
        }}
        aria-label="Toggle theme"
        className="h-8 w-8"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggleButton;
