"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pen, Trash } from "lucide-react";
import { adminAPI, useQuestion } from "@/lib/api";
import { cn, formatDateTime } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import BackButton from "@/components/ui/back-button";

const QuestionViewPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  // Better handling of questionId conversion
  const questionId = parseInt(searchParams.get("questionId") || "", 10);
  if (!questionId) {
    return <div>Invalid question ID.</div>;
  }

  // Only make API calls if we have a valid questionId
  const {
    data: question,
    isLoading: loadingQuestion,
    mutate: mutateQuestion, // Get mutate from useQuestion, not useSubjects
  } = useQuestion(questionId);

  const handleDeleteQuestion = async () => {
    const deleted = await adminAPI.deleteQuestion(questionId);
    if (deleted) {
      router.push("/admin/questions");
    }
  };
  // Move useEffect before early returns
  useEffect(() => {
    if (questionId && !isNaN(questionId)) {
      mutateQuestion(); // This should be the question mutate function
    }
  }, [questionId, mutateQuestion]);

  // Add validation for questionId
  if (!questionId || isNaN(questionId)) {
    return <div>Invalid question ID.</div>;
  }

  if (loadingQuestion) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>Question not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <BackButton />
      <div className="max-w-6xl mx-auto mt-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between relative">
              <div className="space-y-2">
                <CardTitle className="text-2xl">Question Details</CardTitle>
                <CardDescription>
                  Review and manage question information
                </CardDescription>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">#{questionId}</Badge>
                  <Badge variant="outline">{question.subject.name}</Badge>
                </div>
              </div>
              <div className="absolute top-0 right-0 flex items-center gap-2">
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/admin/questions/edit?questionId=${questionId}`}
                        >
                          <Button className="w-full" variant="outline">
                            <Pen className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-destructive hover:text-white border-destructive hover:bg-destructive"
                          onClick={() => setConfirmDelete(true)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed text-sm">
                  {question.text}
                </p>
              </CardContent>
            </Card>

            {/* Answer Choices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Answer Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.choices?.map((choice, idx) => (
                  <div
                    key={choice.id}
                    className={`p-4 rounded-lg border transition-all ${
                      choice.isCorrect
                        ? "bg-muted/50 border-border shadow-sm"
                        : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                            choice.isCorrect
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted-foreground text-background"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={
                            (cn(
                              choice.isCorrect
                                ? "font-medium"
                                : "text-foreground"
                            ),
                            "text-xs")
                          }
                        >
                          {choice.text}
                        </span>
                      </div>
                      {choice.isCorrect && (
                        <Badge variant="default" className="text-xs">Correct Answer</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-semibold">
                      E
                    </span>
                  </div>
                  Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-l-4 border-primary bg-muted/50 p-4 rounded-r-lg">
                  <p className="text-muted-foreground leading-relaxed">
                    {question.explanation || "No explanation available."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Question performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Total Attempts</span>
                  <span className="text-lg font-bold">
                    {(question.answerTrack?.correct || 0) +
                      (question.answerTrack?.incorrect || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Correct</span>
                  <span className="text-lg font-bold">
                    {question.answerTrack?.correct}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Incorrect</span>
                  <span className="text-lg font-bold">
                    {question.answerTrack?.incorrect}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Question Info */}
            <Card>
              <CardHeader>
                <CardTitle>Question Information</CardTitle>
                <CardDescription>Metadata and timestamps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Created
                  </span>
                  <span className="text-xs">
                    {formatDateTime(question.createdAt)}
                  </span>
                </div>
                <Separator />
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Last Updated
                  </span>
                  <span className="text-xs">
                    {formatDateTime(question.updatedAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <div className="w-full">
                    <span className="text-xs font-medium text-muted-foreground block">
                      Created By
                    </span>
                    <span className="text-xs">
                      {question.createdByUser.fullName}
                    </span>
                  </div>
                  <div className="w-full">
                    <span className="text-xs font-medium text-muted-foreground block">
                      Last Updated By
                    </span>
                    <span className="text-xs">
                      {question.updatedByUser.fullName}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        title="Delete Question"
        description="Are you sure you want to delete this question?"
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteQuestion}
      />
    </div>
  );
};

export default QuestionViewPage;
