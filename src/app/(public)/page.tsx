import MCQSection from "@/components/question/MCQSection";
import { metadata as siteMetadata } from "../metadata";
import { Metadata } from "next";
import ThemeToggleButton from "@/components/ui/theme-toggle-btn";

export const metadata: Metadata = siteMetadata;
const HomePage = () => {
  return (
    <div className="min-h-screen bg-background p-1 pt-12 relative">
      <ThemeToggleButton className="absolute top-2 right-2" />
      <MCQSection />
    </div>
  );
};

export default HomePage;
