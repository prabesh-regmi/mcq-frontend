import useSWR, { SWRConfiguration } from 'swr'
import * as apiTypes from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Fetcher function for SWR
const fetcher = async (url: string, options?: RequestInit) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = new Error('API request failed')
    error.message = await response.text()
    ;(error as Error & { status?: number }).status = response.status
    throw error
  }

  return response.json()
}

// Authentication API
export const authAPI = {
  login: async (data: apiTypes.LoginRequest): Promise<apiTypes.LoginResponse> => {
    return fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  register: async (data: apiTypes.RegisterRequest): Promise<apiTypes.RegisterResponse> => {
    return fetcher('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  refreshToken: async (refreshToken: string): Promise<apiTypes.LoginResponse> => {
    const formData = new FormData()
    formData.append('refresh_token', refreshToken)
    
    return fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json())
  },

  sendVerificationEmail: async (): Promise<apiTypes.MessageResponse> => {
    return fetcher('/auth/send-verification-email', { method: 'POST' })
  },

  verifyEmail: async (token: string): Promise<apiTypes.MessageResponse> => {
    return fetcher(`/auth/verify-email?token=${token}`)
  },

  sendResetPassword: async (): Promise<apiTypes.MessageResponse> => {
    return fetcher('/auth/send-reset-password', { method: 'POST' })
  },

  resetPassword: async (token: string, newPassword: string): Promise<apiTypes.MessageResponse> => {
    return fetcher(`/auth/reset-password?token=${token}&new_password=${newPassword}`, {
      method: 'POST',
    })
  },
}

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboard: async (): Promise<apiTypes.DashboardStats> => {
    return fetcher('/admin/dashboard')
  },

  // Subjects
  getSubjects: async (params?: apiTypes.PaginationParams): Promise<apiTypes.Subject[]> => {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    return fetcher(`/admin/subjects?${searchParams.toString()}`)
  },

  getSubject: async (id: number): Promise<apiTypes.Subject> => {
    return fetcher(`/admin/subjects/${id}`)
  },

  createSubject: async (data: apiTypes.CreateSubjectRequest): Promise<apiTypes.Subject> => {
    return fetcher('/admin/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Questions
  getQuestions: async (params?: apiTypes.PaginationParams): Promise<apiTypes.Question[]> => {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    return fetcher(`/admin/questions?${searchParams.toString()}`)
  },

  getQuestion: async (id: number): Promise<apiTypes.Question> => {
    return fetcher(`/admin/questions/${id}`)
  },

  createQuestion: async (data: apiTypes.CreateQuestionRequest): Promise<apiTypes.Question> => {
    return fetcher('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateQuestion: async (id: number, data: apiTypes.UpdateQuestionRequest): Promise<apiTypes.Question> => {
    return fetcher(`/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteQuestion: async (id: number): Promise<apiTypes.MessageResponse> => {
    return fetcher(`/admin/questions/${id}`, { method: 'DELETE' })
  },

  bulkDeleteQuestions: async (data: apiTypes.BulkDeleteRequest): Promise<apiTypes.BulkDeleteResponse> => {
    return fetcher('/admin/questions/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  },

  downloadQuestions: async (type: 'csv' | 'excel'): Promise<Blob> => {
    return fetch(`${API_BASE_URL}/admin/questions/download?type=${type}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).then(res => res.blob())
  },

  // Bulk operations
  previewFile: async (file: File): Promise<apiTypes.PreviewFileResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    
    return fetch(`${API_BASE_URL}/admin/preview-file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    }).then(res => res.json())
  },

  bulkCreateQuestions: async (data: apiTypes.BulkCreateRequest): Promise<apiTypes.BulkCreateResponse> => {
    return fetcher('/admin/question/bulk-create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  downloadFileTemplate: async (type: 'csv' | 'excel'): Promise<Blob> => {
    return fetch(`${API_BASE_URL}/admin/download-file-template?type=${type}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).then(res => res.blob())
  },
}

// Public API
export const publicAPI = {
  getSubjects: async (): Promise<apiTypes.Subject[]> => {
    return fetcher('/subjects')
  },

  getQuestions: async (data: apiTypes.GetQuestionsRequest): Promise<apiTypes.PublicQuestion[]> => {
    return fetcher('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  submitAnswer: async (questionId: number, data: apiTypes.SubmitAnswerRequest): Promise<apiTypes.SubmitAnswerResponse> => {
    return fetcher(`/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getQuestionExplanation: async (questionId: number): Promise<apiTypes.QuestionExplanationResponse> => {
    return fetcher(`/questions/${questionId}/explanation`)
  },
}

// SWR Hooks
export const useSWRConfig = (config?: SWRConfiguration) => {
  return {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
    ...config,
  }
}

// Admin Hooks
export const useDashboard = () => {
  return useSWR<apiTypes.DashboardStats>('/admin/dashboard', fetcher, useSWRConfig())
}

export const useSubjects = (params?: apiTypes.PaginationParams) => {
  const searchParams = new URLSearchParams()
  if (params?.skip) searchParams.append('skip', params.skip.toString())
  if (params?.limit) searchParams.append('limit', params.limit.toString())
  
  return useSWR<apiTypes.Subject[]>(
    `/admin/subjects?${searchParams.toString()}`,
    fetcher,
    useSWRConfig()
  )
}

export const useSubject = (id: number) => {
  return useSWR<apiTypes.Subject>(
    id ? `/admin/subjects/${id}` : null,
    fetcher,
    useSWRConfig()
  )
}

export const useQuestions = (params?: apiTypes.PaginationParams) => {
  const searchParams = new URLSearchParams()
  if (params?.skip) searchParams.append('skip', params.skip.toString())
  if (params?.limit) searchParams.append('limit', params.limit.toString())
  
  return useSWR<apiTypes.Question[]>(
    `/admin/questions?${searchParams.toString()}`,
    fetcher,
    useSWRConfig()
  )
}

export const useQuestion = (id: number) => {
  return useSWR<apiTypes.Question>(
    id ? `/admin/questions/${id}` : null,
    fetcher,
    useSWRConfig()
  )
}

// Public Hooks
export const usePublicSubjects = () => {
  return useSWR<apiTypes.Subject[]>('/subjects', fetcher, useSWRConfig())
} 