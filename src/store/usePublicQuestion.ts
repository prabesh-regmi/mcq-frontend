import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { usePublicStore } from "@/store/usePublicStore";
import { publicAPI } from "@/lib/api";
import type * as apiTypes from "@/types/api";

export function usePublicQuestion(initialQuestionId: number | null = null) {
  const { answeredIds, addAnsweredId, selectedSubjectIds } = usePublicStore();

  const [isLoading, setIsLoading] = useState(false);
  const [questionQueue, setQuestionQueue] = useState<apiTypes.PublicQuestion[]>(
    []
  );
  const [currentQuestion, setCurrentQuestion] =
    useState<apiTypes.PublicQuestion | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Use ref to store the current abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      ...(selectedSubjectIds.length > 0 && { subjectIds: selectedSubjectIds }),
      ...(answeredIds.length > 0 && { excludeQuestionIds: answeredIds }),
    }),
    [selectedSubjectIds, answeredIds]
  );

  const fetchQuestions = useCallback(
    async (
      includeQuestionId?: number | null,
      excludeQuestionIds?: number[]
    ) => {
      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);
      try {
        const params = {
          ...apiParams,
          ...(includeQuestionId && { includeQuestionId }),
          ...(excludeQuestionIds && {
            excludeQuestionIds: Array.from(
              new Set([
                ...excludeQuestionIds,
                ...(apiParams.excludeQuestionIds ?? []),
              ])
            ),
          }),
        };

        const questions: apiTypes.PublicQuestion[] =
          await publicAPI.getQuestions(params, abortController.signal);

        // Check if request was aborted
        if (abortController.signal.aborted) {
          return;
        }

        setQuestionQueue(questions);

        // Determine current question based on context
        let nextQuestion: apiTypes.PublicQuestion | null = null;
        if (includeQuestionId && !hasInitialized) {
          // Initial load with specific question ID
          nextQuestion =
            questions.find((q) => q.id === includeQuestionId) ??
            questions[0] ??
            null;
        } else {
          // Normal flow - take first available question
          nextQuestion = questions[0] ?? null;
        }

        setCurrentQuestion(nextQuestion);
      } catch (error) {
        // Don't handle error if request was aborted
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch questions:", error);
        // Reset state on error to prevent stale data
        setQuestionQueue([]);
        setCurrentQuestion(null);
      } finally {
        // Only update loading state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [apiParams, hasInitialized]
  );

  const nextQuestion = useCallback(() => {
    if (!currentQuestion) return;

    const updatedAnsweredIds = addAnsweredId(currentQuestion.id);

    const remainingQuestions = questionQueue.filter(
      (q) => q.id !== currentQuestion.id
    );

    if (remainingQuestions.length > 0) {
      setQuestionQueue(remainingQuestions);
      setCurrentQuestion(remainingQuestions[0]);
    } else {
      // No more questions in queue, fetch new ones
      fetchQuestions(null, updatedAnsweredIds);
    }
  }, [currentQuestion, questionQueue, addAnsweredId, fetchQuestions]);

  const submitAnswer = useCallback(
    async (questionId: number, data: apiTypes.SubmitAnswerRequest) => {
      try {
        const response = await publicAPI.submitAnswer(questionId, data);
        nextQuestion();
        return response;
      } catch (error) {
        console.error("Failed to submit answer:", error);
        throw error; // Re-throw to allow caller to handle
      }
    },
    [nextQuestion]
  );

  // Cleanup function to abort any pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Initialize on mount
  useEffect(() => {
    fetchQuestions(initialQuestionId);
    setHasInitialized(true);
  }, []); // Only run once on mount

  // Refetch when subject selection changes (but not on initial mount)
  useEffect(() => {
    if (!hasInitialized) return;

    fetchQuestions();
  }, [selectedSubjectIds]); // Remove the join() - direct array comparison is more reliable

  // Computed values
  const hasQuestions = questionQueue.length > 0;
  const isQueueEmpty = !hasQuestions && !isLoading;

  return {
    isLoading,
    currentQuestion,
    questionQueue,
    hasQuestions,
    isQueueEmpty,
    nextQuestion,
    submitAnswer,
    selectedSubjectIds,
    // Expose refetch capability for manual refresh
    refetch: fetchQuestions,
  };
}
