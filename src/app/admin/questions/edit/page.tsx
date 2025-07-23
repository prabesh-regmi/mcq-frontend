"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useQuestion, useSubjects } from "@/lib/api";
import { QuestionFormData } from "@/lib/validations";
import QuestionForm from "@/components/question/QuestionForm";
import BackButton from "@/components/ui/back-button";

const defaultChoice = { text: "", isCorrect: false };

const QuestionEditPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const questionId = Number(params.get("questionId"));

  const { data: question, isLoading: loadingQuestion } =
    useQuestion(questionId);
  const initialData: QuestionFormData = {
    text: question?.text || "",
    subjectId: question?.subjectId || 0,
    choices: question?.choices.map((c) => ({
      text: c.text,
      isCorrect: c.isCorrect,
    })) || [defaultChoice, defaultChoice],
  };

  if (loadingQuestion) return <div>Loading...</div>;
  if (!question) return <div>Question not found.</div>;

  return (
    <div className="min-h-screen-dynamic space-y-4">
      <BackButton />
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-left">
            Edit Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionForm initialData={initialData} questionId={questionId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionEditPage;
