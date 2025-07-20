"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false, trickleSpeed: 100 })

export default function NProgressClient() {
  const pathname = usePathname()

  useEffect(() => {
    NProgress.start()
    NProgress.set(0.3)
    NProgress.inc()
    NProgress.done()
    // eslint-disable-next-line
  }, [pathname])

  return null
} 