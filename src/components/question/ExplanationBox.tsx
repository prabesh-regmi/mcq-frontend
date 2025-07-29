"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Bot, CheckCircle } from "lucide-react";

interface AIExplanationBoxProps {
  isLoading: boolean;
  text?: string;
}

export const ExplanationBox: React.FC<AIExplanationBoxProps> = ({
  isLoading,
  text,
}) => {
  if (!isLoading && !text) return null;

  return (
    <Card className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded animate-in fade-in duration-500 my-3 md:my-8">
      <Accordion type="single" collapsible defaultValue="explanation">
        <AccordionItem value="explanation" className="border-none">
          <AccordionTrigger className="text-left text-lg px-4 md:px-6 py-2 md:py-4 font-semibold hover:no-underline">
            Explanation
          </AccordionTrigger>
          <AccordionContent className="p-4 lg:p-0">
            <CardContent className="p-0 flex items-start space-x-4">
              {isLoading && (
                <Loader2 className="animate-spin text-blue-500 mt-1 shrink-0" />
              )}

              <div className="flex-1">
                {isLoading ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Bot className="text-muted-foreground" size={18} />
                      <p className="text-muted-foreground text-sm font-medium">
                        AI is generating an explanation...
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                      Thinking<span className="dots">...</span>
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                    {text}
                  </div>
                )}
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
