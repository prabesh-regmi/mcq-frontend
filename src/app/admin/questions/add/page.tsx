"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { adminAPI, useSubjects } from '@/lib/api';
import { questionSchema, QuestionFormData } from '@/lib/validations';
import BulkUpload from '@/components/question/BulkUpload';

const defaultChoice = { text: '', isCorrect: false };

const AddQuestionPage = () => {
  const router = useRouter();
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const [choices, setChoices] = useState([{ ...defaultChoice }, { ...defaultChoice }]);
  const [showDialog, setShowDialog] = useState(false);
  const [createdQuestionId, setCreatedQuestionId] = useState<number | null>(null);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: '',
      subjectId: 0,
      explanation: '',
      choices: choices,
    },
  });

  React.useEffect(() => {
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
    const res = await adminAPI.createQuestion(data);
    setCreatedQuestionId(res.id);
    setShowDialog(true);
  };

  const handleCreateAnother = () => {
    setShowDialog(false);
    setChoices([{ ...defaultChoice }, { ...defaultChoice }]);
    form.reset();
  };

  const handleViewQuestion = () => {
    if (createdQuestionId) router.push(`/admin/questions/view/${createdQuestionId}`);
  };

  return (
    <div className="max-h-screen-dynamic flex items-center justify-center bg-background">
      <Tabs defaultValue="single" className="w-full">
        <TabsList>
          <TabsTrigger value="single">Single Create</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Add Question</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSubjects ? (
                <div>Loading...</div>
              ) : (
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
                            <select {...field} className="w-full border rounded px-2 py-2 bg-background">
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
                              <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveChoice(idx)}>
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
                    <Button type="submit" className="w-full mt-6">Create Question</Button>
                  </form>
                </Form>
              )}
              {/* Success Dialog */}
              {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                    <h2 className="text-lg font-bold mb-4">Question Created!</h2>
                    <div className="flex flex-col gap-2">
                      <Button onClick={handleCreateAnother} variant="outline">Create Another</Button>
                      <Button onClick={handleViewQuestion}>View Question</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulk">
          <BulkUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddQuestionPage; 