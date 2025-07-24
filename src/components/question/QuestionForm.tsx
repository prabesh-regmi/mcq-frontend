"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionFormData, questionSchema } from "@/lib/validations";
import { adminAPI, useSubjects } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";

type QuestionFormProps = {
  questionId?: number;
  initialData?: QuestionFormData;
  onSuccess?: (id?: number) => void;
};

const defaultChoice = { text: "", isCorrect: false };

const QuestionForm: React.FC<QuestionFormProps> = ({
  questionId,
  initialData,
  onSuccess,
}) => {
  const router = useRouter();
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();

  const [choices, setChoices] = useState(
    initialData?.choices?.length
      ? initialData.choices
      : [{ ...defaultChoice }, { ...defaultChoice }]
  );
  const [showDialog, setShowDialog] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: initialData?.text || "",
      subjectId: initialData?.subjectId || 0,
      choices: initialData?.choices || choices,
    },
  });

  useEffect(() => {
    form.setValue("choices", choices);
  }, [choices]);

  const handleChoiceChange = (idx: number, value: string) => {
    setChoices((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, text: value } : c))
    );
  };

  const handleCorrectChange = (idx: number) => {
    setChoices((prev) => prev.map((c, i) => ({ ...c, isCorrect: i === idx })));
  };

  const handleAddChoice = () => {
    if (choices.length < 4) {
      setChoices([...choices, { ...defaultChoice }]);
    }
  };

  const handleRemoveChoice = (idx: number) => {
    if (choices.length > 2) {
      setChoices(choices.filter((_, i) => i !== idx));
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const res = questionId
        ? await adminAPI.updateQuestion(questionId, data)
        : await adminAPI.createQuestion(data);

      const id = res.id || questionId;
      setCreatedId(id ?? null);
      setShowDialog(true);
      onSuccess?.(id);
    } catch (err) {
      console.error("Failed to save question", err);
    }
  };

  const handleResetOrBack = () => {
    if (initialData) {
      router.back();
    } else {
      setShowDialog(false);
      setChoices([{ ...defaultChoice }, { ...defaultChoice }]);
      form.reset();
    }
  };

  const handleViewQuestion = () => {
    if (createdId) {
      router.push(`/admin/questions/view?questionId=${createdId}`);
    }
  };

  if (loadingSubjects) return <Spinner />;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Question <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter question text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Subject <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full border rounded px-2 py-2 bg-background"
                  >
                    <option value="">Select subject</option>
                    {subjects?.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <div className="block font-medium mb-2">
              Choices <span className="text-red-500">*</span>
            </div>
            <div className="space-y-2">
              {choices.map((choice, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-2">
                    <Input
                      value={choice.text}
                      onChange={(e) => handleChoiceChange(idx, e.target.value)}
                      placeholder={`Choice ${idx + 1}`}
                      className="flex-1"
                    />
                    <Checkbox
                      checked={choice.isCorrect}
                      onCheckedChange={() => handleCorrectChange(idx)}
                      className="ml-2"
                    />
                    <span className="text-xs">Correct</span>
                    {choices.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveChoice(idx)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {Array.isArray(form.formState.errors.choices) &&
                    form.formState.errors.choices[idx].text && (
                      <p className="text-sm text-red-500 mt-2">
                        {form.formState.errors.choices[idx].text.message}
                      </p>
                    )}
                </React.Fragment>
              ))}
            </div>
            {choices.length < 4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddChoice}
                className="mt-2"
              >
                Add Choice
              </Button>
            )}
            {form.formState.errors.choices && (
              <p className="text-sm text-red-500 mt-2">
                {form.formState.errors.choices.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full mt-6">
            {initialData ? "Update Question" : "Create Question"}
          </Button>
        </form>
      </Form>

      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Question Updated!" : "Question Created!"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <Button onClick={handleResetOrBack} variant="outline">
              {initialData ? "Back to List" : "Create Another"}
            </Button>
            <Button onClick={handleViewQuestion}>View Question</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionForm;
