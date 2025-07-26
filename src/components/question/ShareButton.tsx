import React from "react";
import CopyButton from "@/components/ui/copy-btn";
import Image from "next/image";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const ShareButton = ({ text }: { text: string }) => {
  return (
    <div className="flex justify-end">
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <CopyButton
                textToCopy={text}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20,80 C20,45 45,40 60,40 L60,20 L90,50 L60,80 L60,60 C35,60 30,65 20,80 Z" />
                </svg>
              </CopyButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy Question link</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default ShareButton;
