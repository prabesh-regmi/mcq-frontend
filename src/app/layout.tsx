import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SWRConfig } from 'swr'
import { ThemeProvider } from '@/components/providers/theme-provider'
import NProgressClient from '@/components/providers/NProgressClient'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MCQ Admin Dashboard",
  description: "A comprehensive admin dashboard for managing multiple choice questions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NProgressClient />
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              revalidateOnReconnect: true,
              dedupingInterval: 60000,
            }}
          >
            {children}
          </SWRConfig>
        </ThemeProvider>
      </body>
    </html>
  )
}
