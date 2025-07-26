"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Menu,
  LogOut,
  User,
  Moon,
  Sun,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Questions", href: "/admin/questions", icon: BookOpen },
  { name: "Subjects", href: "/admin/subjects", icon: FolderOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-[100svh] bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed z-40 left-0 top-0 h-[100svh] hidden lg:flex flex-col bg-card border-r transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex items-center h-16 border-b transition-all duration-300",
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                sidebarCollapsed ? "ml-2" : ""
              }`}
            >
              <Image src="/logo.png" alt="EQ Admin" width={32} height={32} className="size-8 text-primary-foreground" />
            </div>
            <span
              className={cn(
                "text-xl font-bold transition-opacity duration-300 overflow-hidden whitespace-nowrap",
                sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
              )}
            >
              EQ Admin
            </span>
          </Link>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(true)}
              aria-label="Collapse sidebar"
              className="size-8"
            >
              {/* <Menu className="h-4 w-4" /> */}
              <PanelLeftClose className="size-4" />
            </Button>
          )}
        </div>

        {/* Sidebar Toggle Button (when collapsed) */}
        {sidebarCollapsed && (
          <div className="flex justify-center p-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(false)}
              aria-label="Expand sidebar"
              className="h-8 w-8"
            >
              {/* <Menu className="h-4 w-4" /> */}
              <PanelLeftOpen className="size-4" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto overflow-x-hidden">
          <TooltipProvider>
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const linkElement = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 relative",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    sidebarCollapsed ? "justify-center" : "justify-start"
                  )}
                  tabIndex={0}
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="transition-opacity duration-300">
                      {item.name}
                    </span>
                  )}
                </Link>
              );

              return (
                <div key={item.name}>
                  {sidebarCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkElement
                  )}
                </div>
              );
            })}
          </TooltipProvider>
        </nav>

        {/* Logout Button */}

        <div
          className={cn(
            "mt-auto p-3 border-t transition-all duration-300",
            sidebarCollapsed ? "flex justify-center" : ""
          )}
        >
          <TooltipProvider>
            {sidebarCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    aria-label="Logout"
                    className={cn(
                      "transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent",
                      sidebarCollapsed
                        ? "h-10 w-10 p-0"
                        : "w-full justify-start"
                    )}
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span
                      className={cn(
                        "ml-3 transition-opacity duration-300 overflow-hidden whitespace-nowrap",
                        sidebarCollapsed ? "opacity-0 w-0 ml-0" : "opacity-100"
                      )}
                    >
                      Logout
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                onClick={handleLogout}
                aria-label="Logout"
                className={cn(
                  "transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent",
                  sidebarCollapsed ? "h-10 w-10 p-0" : "w-full justify-start"
                )}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span
                  className={cn(
                    "ml-3 transition-opacity duration-300 overflow-hidden whitespace-nowrap",
                    sidebarCollapsed ? "opacity-0 w-0 ml-0" : "opacity-100"
                  )}
                >
                  Logout
                </span>
              </Button>
            )}
          </TooltipProvider>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed z-50 left-0 top-0 h-[100svh] w-64 bg-card border-r flex flex-col transform transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-2"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MCQ Admin</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
                tabIndex={0}
                aria-label={item.name}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Logout Button */}
        <div className="mt-auto p-3 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            aria-label="Logout"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-[100svh] transition-all duration-300",
          // Desktop sidebar spacing
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64",
          // No left padding on mobile
          "pl-0"
        )}
      >
        {/* Top Navigation Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b bg-background px-4 sm:px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              {navigation.find((item) => pathname.startsWith(item.href))
                ?.name || "Admin"}
            </h1>
          </div>

          {/* Right Side: User Menu and Theme Toggle */}
          <div className="flex items-center gap-x-2">
            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profileImage}
                      alt={user?.fullName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {(user?.fullName &&
                        user.fullName.charAt(0).toUpperCase()) ||
                        "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.fullName && (
                      <p className="font-medium">{user.fullName}</p>
                    )}
                    {user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
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
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative">{children}</main>
      </div>
    </div>
  );
}
