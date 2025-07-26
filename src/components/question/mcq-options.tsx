"use client";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MCQOptionProps {
  id: string;
  option: string;
  index: number;
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  revealedAnswer: boolean;
  handleAnswerSelect: (index: number) => void;
  isCorrectAnswer: boolean;
}

export const MCQOption = ({
  id,
  option,
  index,
  selectedAnswer,
  correctAnswer,
  showResult,
  revealedAnswer,
  handleAnswerSelect,
  isCorrectAnswer,
}: MCQOptionProps) => {
  const isSelected = selectedAnswer === index;
  const isCorrect = index === correctAnswer;
  const showCorrect = revealedAnswer && isCorrect;

  // Determine colors
  let textColor = "";
  let radioBg = "";

  if (showResult && isSelected) {
    if (isCorrect) {
      textColor = "text-primary";
      //   radioColor = "border-primary";
      radioBg = "bg-primary";
    } else {
      textColor = "text-destructive";
      //   radioColor = "border-red-500";
      radioBg = "bg-red-500";
    }
  } else if (showCorrect) {
    textColor = "text-primary";
    // radioColor = "border-primary";
    radioBg = "bg-primary";
  } else if (isSelected) {
    radioBg = "bg-blue-500";
  }

  const isDisabled = showResult && isCorrectAnswer && !isSelected;

  return (
    <div className="flex items-center">
      <div
        className={`relative w-5 h-5 rounded-full border-2 ${radioBg}`}
      >
        <RadioGroupItem
          value={index.toString()}
          id={id}
          onClick={() => handleAnswerSelect(index)}
          disabled={isDisabled}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <Label htmlFor={id} className={`${textColor} ml-3 cursor-pointer`}>
        {option}
      </Label>
    </div>
  );
};
