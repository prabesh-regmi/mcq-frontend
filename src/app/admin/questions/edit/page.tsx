"use client"

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { adminAPI, useQuestion, useSubjects } from '@/lib/api';
import { questionSchema, QuestionFormData } from '@/lib/validations';

const defaultChoice = { text: '', isCorrect: false };

const QuestionEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const questionId = Number(params?.questionId);

  const { data: question, isLoading: loadingQuestion } = useQuestion(questionId);
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const [choices, setChoices] = useState([{ ...defaultChoice }, { ...defaultChoice }]);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: '',
      subjectId: 0,
      explanation: '',
      choices: choices,
    },
  });

  useEffect(() => {
    if (question) {
      form.reset({
        text: question.text,
        subjectId: question.subjectId,
        explanation: question.explanation,
        choices: question.choices.map(({ text, isCorrect }) => ({ text, isCorrect })),
      });
      setChoices(question.choices.map(({ text, isCorrect }) => ({ text, isCorrect })));
    }
  }, [question]);

  useEffect(() => {
    form.setValue('choices', choices);
  }, [choices]);

  const handleChoiceChange = (idx: number, value: string) => {
    setChoices(prev => prev.map((c, i) => i === idx ? { ...c, text: value } : c));
  };

  const handleAddChoice = () => {
    if (choices.length < 6) setChoices([...choices, { ...defaultChoice }]);
  };

  const handleRemoveChoice = (idx: number) => {
    if (choices.length > 2) setChoices(choices.filter((_, i) => i !== idx));
  };

  const handleCorrectChange = (idx: number) => {
    setChoices(prev => prev.map((c, i) => ({ ...c, isCorrect: i === idx })));
  };

  const onSubmit = async (data: QuestionFormData) => {
    await adminAPI.updateQuestion(questionId, data);
    router.push('/admin/questions');
  };

  if (loadingQuestion || loadingSubjects) return <div>Loading...</div>;
  if (!question) return <div>Question not found.</div>;

  return (
    <div className="min-h-screen-dynamic flex items-center justify-center bg-background p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Edit Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
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
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full border rounded px-2 py-2">
                        <option value="">Select subject</option>
                        {subjects?.map((subject) => (
                          <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter explanation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <div className="block font-medium mb-2">Choices</div>
                <div className="space-y-2">
                  {choices.map((choice, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={choice.text}
                        onChange={e => handleChoiceChange(idx, e.target.value)}
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
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveChoice(idx)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {choices.length < 6 && (
                  <Button type="button" variant="outline" size="sm" onClick={handleAddChoice} className="mt-2">
                    Add Choice
                  </Button>
                )}
              </div>
              <Button type="submit" className="w-full mt-6">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionEditPage; 