import { Ban } from "lucide-react";

export default function NoQuestionsAvailable() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <Ban className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-muted-foreground">
        No Questions Available
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Try selecting a different subject or check back later.
      </p>
    </div>
  );
}
