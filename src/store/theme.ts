import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
}

interface ThemeActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  syncTheme: () => void
}

type ThemeStore = ThemeState & ThemeActions

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    theme = getSystemTheme()
  }
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.remove('dark')
    root.classList.add('light')
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme: Theme) => {
        set({ theme })
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', theme)
          applyThemeClass(theme)
        }
      },
      toggleTheme: () => {
        const currentTheme = get().theme
        let newTheme: Theme
        if (currentTheme === 'system') {
          newTheme = getSystemTheme() === 'dark' ? 'light' : 'dark'
        } else {
          newTheme = currentTheme === 'light' ? 'dark' : 'light'
        }
        get().setTheme(newTheme)
      },
      syncTheme: () => {
        if (typeof window !== 'undefined') {
          let theme: Theme = 'system'
          const stored = localStorage.getItem('theme') as Theme | null
          if (stored === 'light' || stored === 'dark') {
            theme = stored
          } else {
            theme = 'system'
          }
          set({ theme })
          applyThemeClass(theme)
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)

// On load, sync theme with localStorage or system
if (typeof window !== 'undefined') {
  useThemeStore.getState().syncTheme()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().theme === 'system') {
      useThemeStore.getState().syncTheme()
    }
  })
} 