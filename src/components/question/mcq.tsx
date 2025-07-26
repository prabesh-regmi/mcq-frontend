"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import { MCQOption } from "@/components/question/mcq-options";
import { PublicQuestion } from "@/types/api";
import { publicAPI } from "@/lib/api";
import { toast } from "sonner";
import { ExplanationBox } from "./ExplanationBox";

interface McqQuestionProps {
  question: PublicQuestion;
  onNext: () => void;
}

const McqQuestion = ({ question, onNext }: McqQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showRevealAnswer, setShowRevealAnswer] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState("");

  // Find the correct answer index (which index in the choices array has is_correct: true)
  const correctAnswerIndex = question.choices.findIndex(
    (choice) => choice.isCorrect
  );

  const handleAnswerSelect = async (answerIndex: number) => {
    // Prevent selection if answer is revealed
    if (revealedAnswer) return;

    // Set the selected answer
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    // Check if the selected answer is correct by comparing indices
    const isCorrect = answerIndex === correctAnswerIndex;

    if (!isCorrect) {
      setShowRevealAnswer(true);
    } else {
      setShowRevealAnswer(false);
      setRevealedAnswer(false);
    }
    await publicAPI.submitAnswer(question.id, {
      choiceId: question.choices[answerIndex].id,
    });
  };

  const handleNextQuestion = () => {
    onNext();
  };

  const handleRevealAnswer = () => {
    setRevealedAnswer(true);
    setShowRevealAnswer(false);
  };

  const handleExplanation = async () => {
    try {
      setIsLoading(true);
      const res = await publicAPI.getQuestionExplanation(question.id);
      setExplanation(res.explanation);
    } catch (error) {
      toast.error("Failed to submit explanation");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowRevealAnswer(false);
    setRevealedAnswer(false);
    setExplanation("");
  }, [question]);

  // Check if the selected answer is correct
  const isCorrectAnswer =
    selectedAnswer !== null && selectedAnswer === correctAnswerIndex;
  const isNextDisabled = selectedAnswer === null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Q. {question.text}</h2>

      {/* Options */}
      <RadioGroup className="space-y-2 mb-10">
        {question.choices.map((choice, index) => (
          <MCQOption
            key={choice.id}
            id={`option-${question.id}-${choice.id}`}
            option={choice.text}
            index={index}
            selectedAnswer={selectedAnswer}
            correctAnswer={correctAnswerIndex}
            showResult={showResult}
            revealedAnswer={revealedAnswer}
            handleAnswerSelect={handleAnswerSelect}
            isCorrectAnswer={isCorrectAnswer}
          />
        ))}
      </RadioGroup>

      {/* Result Message */}
      <div className="mb-6 min-h-10">
        {showResult && (
          <div>
            {isCorrectAnswer ? (
              <div className="flex items-center text-primary">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  Correct answer! Keep it up...
                </span>
              </div>
            ) : (
              <div className="flex items-center text-destructive">
                <XCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Wrong Answer. Try again...</span>
              </div>
            )}
          </div>
        )}
      </div>
      <ExplanationBox isLoading={isLoading} text={explanation} />
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          onClick={handleNextQuestion}
          disabled={isNextDisabled}
          className="flex items-center gap-2 rounded-full cursor-pointer"
          variant="outline"
        >
          Next Question
        </Button>
        {showRevealAnswer && !revealedAnswer && (
          <Button
            variant="outline"
            onClick={handleRevealAnswer}
            className="flex items-center gap-2 rounded-full cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Reveal Answer
          </Button>
        )}
        {(revealedAnswer || isCorrectAnswer) && !explanation && (
          <Button
            variant="outline"
            onClick={handleExplanation}
            className="flex items-center gap-2 rounded-full cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Show Explanation
          </Button>
        )}
      </div>
    </div>
  );
};

export default McqQuestion;
