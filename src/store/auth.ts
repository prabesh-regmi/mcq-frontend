import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  hasHydrated: boolean
}

interface AuthActions {
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  clearAuth: () => void
  hydrate: () => void
  setHasHydrated: (v: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      hasHydrated: false,
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        })
      },
      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken })
      },
      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isAdmin: false,
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }
      },
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isAdmin: false,
        })
      },
      hydrate: () => {
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken')
          const refreshToken = localStorage.getItem('refreshToken')
          const userStr = localStorage.getItem('user')
          let user: User | null = null
          try {
            user = userStr ? JSON.parse(userStr) : null
          } catch {
            user = null
          }
          set({
            accessToken,
            refreshToken,
            user,
            isAuthenticated: !!accessToken && !!user,
            isAdmin: user?.role === 'admin',
          })
        }
      },
      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrate?.()
        state?.setHasHydrated?.(true)
      },
    }
  )
) 