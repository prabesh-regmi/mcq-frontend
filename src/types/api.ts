// Authentication Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profileImage?: string;
  role: string;
}
export interface UserMinimal {
  id: number;
  email: string;
  fullName: string;
  profileImage?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  profileImage?: string;
}

export type RegisterResponse = User;

// Subject Types
export interface Subject {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectRequest {
  name: string;
}

// Question Types
export interface Choice {
  id: number;
  text: string;
  isCorrect: boolean;
}
export interface AnswerTrack {
  id: number;
  questionId: number;
  correct: number;
  incorrect: number;
}

export interface Question {
  id: number;
  text: string;
  subjectId: number;
  explanation: string;
  subject?: {
    name: string;
  };
  choices: Choice[];
  answerTrack?: AnswerTrack;
  createdAt: string;
  updatedAt: string;
  createdByUser: UserMinimal;
  updatedByUser: UserMinimal;
}

export interface CreateQuestionRequest {
  text: string;
  subjectId: number;
  choices: { text: string; isCorrect: boolean }[];
}

export type UpdateQuestionRequest = CreateQuestionRequest;

export interface BulkQuestion {
  text: string;
  subject: string;
  choices: { text: string; isCorrect: boolean }[];
}

export interface BulkCreateRequest {
  questions: BulkQuestion[];
  newSubjects?: string[];
}

export interface BulkCreateResponse {
  message: string;
  createdCount: number;
}

export interface BulkDeleteRequest {
  ids: number[];
}

export interface BulkDeleteResponse {
  message: string;
  deletedCount: number;
  deletedIds: number[];
}

// Dashboard Types
export interface DashboardStats {
  totalQuestions: number;
  totalSubjects: number;
  totalAttempts: number;
  totalCorrect: number;
  totalIncorrect: number;
  subjectWiseQuestionCounts: { subject: string; questionCount: number }[];
  monthlyNewQuestions: Record<string, number>;
}

// Public API Types
export interface PublicQuestion {
  id: number;
  text: string;
  subject: {
    id: number;
    name: string;
  };
  choices: {
    id: number;
    text: string;
    is_correct: boolean;
  }[];
}

export interface GetQuestionsRequest {
  subjectIds?: number[];
  questionIds?: number[];
}

export interface SubmitAnswerRequest {
  choiceId: number;
}

export interface SubmitAnswerResponse {
  detail: string;
}

export interface QuestionExplanationResponse {
  explanation: string;
}

// Pagination Types
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

// File Upload Types
export interface PreviewFileResponse {
  newSubjects: string[];
  questions: BulkQuestion[];
}

// Generic Response Types
export interface MessageResponse {
  message: string;
}

// Admin API Types for /api/admin/questions
export interface AdminChoice {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface AdminQuestion {
  id: number;
  text: string;
  subjectId: number;
  subjectName: string;
  explanation: string;
  choices: AdminChoice[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAdminQuestionsResponse {
  total: number;
  skip: number;
  limit: number;
  data: AdminQuestion[];
}
