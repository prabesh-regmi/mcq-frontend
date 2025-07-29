"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { toast } from "sonner";

interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
  children?: ReactNode;
  successMessage?: string;
  errorMessage?: string;
}

export default function CopyButton({
  textToCopy,
  children = "Copy",
  successMessage = "Copied to clipboard!",
  errorMessage = "Failed to copy",
  ...props
}: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(successMessage);
    } catch (err) {
      toast.error(errorMessage);
    }
  };

  return (
    <span onClick={handleCopy} {...props}>
      {children}
    </span>
  );
}
