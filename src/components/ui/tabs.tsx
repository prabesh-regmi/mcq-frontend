"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [activeIndex, setActiveIndex] = React.useState<number>(0)
  const [hoverStyle, setHoverStyle] = React.useState({})
  const [activeStyle, setActiveStyle] = React.useState({ left: "0px", width: "0px" })
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const childrenArray = React.useMemo(() => React.Children.toArray(children), [children])

  React.useEffect(() => {
    const activeEl = tabRefs.current[activeIndex]
    if (activeEl) {
      setActiveStyle({
        left: `${activeEl.offsetLeft}px`,
        width: `${activeEl.offsetWidth}px`,
      })
    }
  }, [activeIndex])

  React.useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredEl = tabRefs.current[hoveredIndex]
      if (hoveredEl) {
        setHoverStyle({
          left: `${hoveredEl.offsetLeft}px`,
          width: `${hoveredEl.offsetWidth}px`,
        })
      }
    }
  }, [hoveredIndex])

  return (
    <div className="relative">
      {/* Hover highlight */}
      <div
        className="absolute h-[30px] transition-all duration-300 ease-out bg-muted rounded-md"
        style={{
          ...hoverStyle,
          opacity: hoveredIndex !== null ? 1 : 0,
        }}
      />

      {/* Active underline */}
      <div
        className="absolute bottom-0 h-[2px] bg-foreground transition-all duration-300 ease-out"
        style={activeStyle}
      />

      {/* Tabs container */}
      <TabsPrimitive.List
        ref={ref}
        className={cn("relative z-10 inline-flex items-center space-x-1 px-1", className)}
        {...props}
      >
        {childrenArray.map((child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child as any, {
              ref: (el: HTMLButtonElement) => (tabRefs.current[index] = el),
              onMouseEnter: () => setHoveredIndex(index),
              onMouseLeave: () => setHoveredIndex(null),
              onClick: () => setActiveIndex(index),
              isActive: index === activeIndex,
            })
            : child
        )}
      </TabsPrimitive.List>
    </div>
  )
})

TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    isActive?: boolean
  }
>(({ className, isActive, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-20 px-3 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none",
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-4 focus:outline-none", className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
