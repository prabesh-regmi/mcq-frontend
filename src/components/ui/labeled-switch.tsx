"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface LabeledSwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label: string;
  width?: number;
  size?: "small" | "default"; // Add size prop
}

const LabeledSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  LabeledSwitchProps
>(({ className, label, width, size = "default", ...props }, ref) => {
  // Size-based dimensions
  const dimensions = {
    small: {
      height: 24, // h-6
      thumbSize: 20, // 5x5
      defaultWidth: 64,
      textSize: "text-xs",
      padding: 2,
    },
    default: {
      height: 40, // h-10
      thumbSize: 32, // 8x8
      defaultWidth: 96,
      textSize: "text-sm",
      padding: 4,
    },
  };

  const config = dimensions[size];
  const switchWidth = width || config.defaultWidth;
  const thumbTranslation = switchWidth - config.thumbSize - config.padding * 2;

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200 relative",
        className
      )}
      style={{
        width: `${switchWidth}px`,
        height: `${config.height}px`,
        padding: `${config.padding}px`,
      }}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 z-10"
        )}
        style={{
          width: `${config.thumbSize}px`,
          height: `${config.thumbSize}px`,
          transform: props.checked
            ? `translateX(${thumbTranslation}px)`
            : "translateX(0px)",
        }}
      />
      <span
        className={cn(
          "absolute inset-0 flex items-center font-medium transition-colors",
          config.textSize,
          "data-[state=checked]:text-primary-foreground data-[state=unchecked]:text-gray-700",
          // When checked (ON): text on LEFT, when unchecked (OFF): text on RIGHT
          "data-[state=checked]:justify-start data-[state=checked]:pl-2",
          "data-[state=unchecked]:justify-end data-[state=unchecked]:pr-2"
        )}
        data-state={props.checked ? "checked" : "unchecked"}
      >
        {label}
      </span>
    </SwitchPrimitives.Root>
  );
});
LabeledSwitch.displayName = "LabeledSwitch";

export { LabeledSwitch };
