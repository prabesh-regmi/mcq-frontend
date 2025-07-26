"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import McqQuestion from "@/components/question/mcq";
import Spinner from "@/components/ui/spinner";
import { usePublicQuestion } from "@/store/usePublicQuestion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { usePublicStore } from "@/store/usePublicStore";
import ShareButton from "./ShareButton";
import { publicAPI, usePublicSubjects } from "@/lib/api";
import NoQuestionsAvailable from "./NoQuestionsAvailable";

const MCQSection = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [initialQuestionId] = React.useState<number | null>(
    () => parseInt(searchParams.get("questionId") || "", 10) || null
  );
  const { isLoading, currentQuestion, nextQuestion } =
    usePublicQuestion(initialQuestionId);
  const { selectedSubjectIds, setSelectedSubjectIds } = usePublicStore();
  const { isLoading: isLoadingSubjects, data: subjects } = usePublicSubjects();

  const handleNextQuestion = () => {
    nextQuestion();
  };
  useEffect(() => {
    if (currentQuestion) {
      const currentSearchParams = new URLSearchParams(searchParams.toString());
      currentSearchParams.set("questionId", String(currentQuestion.id));
      router.push(`${pathname}?${currentSearchParams.toString()}`);
    } else {
      router.replace(`${pathname}`);
    }
  }, [currentQuestion?.id]);

  const handleSubjectSelect = (subjectId: number) => {
    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds(
        selectedSubjectIds.filter((id) => id !== subjectId)
      );
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  const isPageLoading = isLoading || isLoadingSubjects;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-6 shadow-none">
        <CardHeader className="text-center bg-muted p-2 md:p-3 lg:p-4">
          <CardTitle className="text-md font-bold text-left flex align-center gap-2 md:gap-4">
            <LabeledSwitch
              label="All"
              size="small"
              width={50}
              checked={selectedSubjectIds.length === 0}
              onCheckedChange={() => setSelectedSubjectIds([])}
            />
            <p>Multiple Choice Questions</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-3 lg:p-4">
          <div>
            {isPageLoading && <Spinner />}
            {!isPageLoading && currentQuestion && (
              <ShareButton text={window.location.href} />
            )}
            {!isPageLoading &&
              (currentQuestion ? (
                <McqQuestion
                  question={currentQuestion}
                  onNext={handleNextQuestion}
                />
              ) : (
                <NoQuestionsAvailable />
              ))}
          </div>
        </CardContent>
        <CardFooter className="p-2 md:p-3 lg:p-4 flex gap-2 md:gap-4 flex-wrap">
          {subjects?.map((subject, idx) => (
            <LabeledSwitch
              key={idx}
              label={subject.name}
              size="small"
              width={44 + subject.name.length * 6}
              checked={selectedSubjectIds.includes(subject.id)}
              onCheckedChange={() => handleSubjectSelect(subject.id)}
            />
          ))}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MCQSection;
