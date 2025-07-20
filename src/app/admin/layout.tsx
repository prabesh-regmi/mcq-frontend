"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import AdminLayout from '@/components/layout/admin-layout'

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isAdmin, isLoading, hydrate, hasHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (hasHydrated && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (!isAdmin) {
        router.push('/')
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, hasHydrated, router])

  if (!hasHydrated || isLoading) {
    return (
      <div className="min-h-screen-dynamic flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
} 