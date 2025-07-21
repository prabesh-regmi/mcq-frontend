"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuestion, useSubjects, useDashboard } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

const QuestionViewPage = () => {
  const params = useParams();
  const questionId = Number(params?.questionId);
  const { data: question, isLoading: loadingQuestion } = useQuestion(questionId);
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const { data: dashboard, isLoading: loadingDashboard } = useDashboard();
  console.log(question)
  if (loadingQuestion || loadingSubjects || loadingDashboard) return <div>Loading...</div>;
  if (!question) return <div>Question not found.</div>;

  const subject = subjects?.find(s => s.id === question.subjectId);

  // Attempt stats (fallback to dashboard totals if per-question not available)
  // If you have per-question stats, replace this logic
  const totalAttempted = dashboard?.totalAttempts ?? 'N/A';
  const totalCorrect = dashboard?.totalCorrect ?? 'N/A';
  const totalIncorrect = dashboard?.totalIncorrect ?? 'N/A';

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Question Details</h1>
      <div className="mb-4">
        <div className="font-semibold">Question:</div>
        <div>{question.text}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Subject:</div>
        <div>{subject?.name || 'N/A'}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Explanation:</div>
        <div>{question.explanation}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Choices:</div>
        <ul className="list-disc pl-6">
          {question.choices.map((choice, idx) => (
            <li key={choice.id} className={choice.isCorrect ? 'font-semibold text-green-700' : ''}>
              {choice.text} {choice.isCorrect && <span className="ml-2 text-xs text-green-700">(Correct)</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Created At:</div>
        <div>{formatDateTime(question.createdAt)}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Last Updated:</div>
        <div>{formatDateTime(question.updatedAt)}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Updated By:</div>
        <div>N/A</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Attempts:</div>
        <div>Total: {totalAttempted}</div>
        <div>Correct: {totalCorrect}</div>
        <div>Incorrect: {totalIncorrect}</div>
      </div>
    </div>
  );
};

export default QuestionViewPage; 