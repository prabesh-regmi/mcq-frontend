"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Menu,
  LogOut,
  User,
  Settings,
  Moon,
  Sun
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Questions', href: '/admin/questions', icon: BookOpen },
  { name: 'Subjects', href: '/admin/subjects', icon: FolderOpen },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const handleLogout = () => {
    logout()
  }

  // Sidebar width
  const sidebarWidth = sidebarCollapsed ? 56 : 256 // px
  const sidebarWidthClass = sidebarCollapsed ? 'w-[56px]' : 'w-64'

  return (
    <div className="relative min-h-screen-dynamic bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed z-40 left-0 top-0 h-[100svh] flex flex-col bg-card border-r transition-all duration-300',
          sidebarWidthClass,
          sidebarCollapsed ? 'items-center' : 'items-stretch',
          'group/sidebar'
        )}
        style={{ width: sidebarWidth }}
      >
        {/* Sidebar header with logo and toggle */}
        <div className={cn('flex items-center justify-between h-16 px-2 border-b', sidebarCollapsed ? 'px-2' : 'px-4')}
        >
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[var(--primary-foreground)]" />
            </div>
            {!sidebarCollapsed && <span className="text-xl font-bold">MCQ Admin</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={cn('ml-auto', 'hidden lg:flex')}
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {/* Navigation (scrollable) */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 group relative',
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
                  sidebarCollapsed ? 'justify-center' : 'justify-start'
                )}
                tabIndex={0}
                aria-label={item.name}
              >
                <item.icon className="h-5 w-5" />
                {!sidebarCollapsed && <span>{item.name}</span>}
                {sidebarCollapsed && (
                  <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-card px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        {/* Sidebar bottom: Logout */}
        <div className={cn('mt-auto p-2 border-t flex flex-col items-center', sidebarCollapsed ? 'px-2' : 'px-4')}
        >
          <Button
            variant="ghost"
            className={cn('w-full justify-start text-muted-foreground hover:text-foreground', sidebarCollapsed && 'justify-center p-0')}
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {!sidebarCollapsed && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-col min-h-screen-dynamic transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-[56px]' : 'lg:pl-64'
        )}
        style={{ paddingLeft: sidebarOpen ? 0 : undefined }}
      >
        {/* Top navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b bg-[var(--background)] shadow-sm px-4">
          {/* Sidebar toggle for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* Page title (optional: breadcrumbs) */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navigation.find(item => item.href === pathname)?.name || 'Admin'}
            </h1>
          </div>
          {/* User avatar menu and theme toggler */}
          <div className="flex items-center gap-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 bg-[var(--primary)]">
                    <AvatarImage src={user?.profileImage} alt={user?.fullName} />
                    <AvatarFallback className="bg-[var(--primary)] text-[var(--primary-foreground)]">
                      {(user?.fullName && user.fullName.charAt(0).toUpperCase()) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50 bg-[var(--card)] text-[var(--card-foreground)]" align="end" forceMount>
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
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      {/* Mobile sidebar overlay and drawer */}
      {sidebarOpen && (
        <aside className="fixed inset-0 z-50 flex lg:hidden">
          <div className="relative w-64 h-[100svh] bg-card border-r flex flex-col">
            {/* Sidebar header with logo and close */}
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[var(--primary-foreground)]" />
                </div>
                <span className="text-xl font-bold">MCQ Admin</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 group relative',
                      isActive
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
                      'justify-start'
                    )}
                    tabIndex={0}
                    aria-label={item.name}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            {/* Sidebar bottom: Logout */}
            <div className="mt-auto p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
          {/* Overlay click area */}
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </aside>
      )}
    </div>
  )
} 