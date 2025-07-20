"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useQuestions, useSubjects } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, MoreHorizontal, Search, Filter } from 'lucide-react'
import { formatDate, truncateText } from '@/lib/utils'

export default function QuestionsPage() {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(50)

  const { data: questions, error, isLoading } = useQuestions({
    skip: currentPage * pageSize,
    limit: pageSize,
  })

  const { data: subjects } = useSubjects()

  const handleSelectAll = (checked: boolean) => {
    if (checked && questions) {
      setSelectedQuestions(questions.map(q => q.id))
    } else {
      setSelectedQuestions([])
    }
  }

  const handleSelectQuestion = (questionId: number, checked: boolean) => {
    if (checked) {
      setSelectedQuestions(prev => [...prev, questionId])
    } else {
      setSelectedQuestions(prev => prev.filter(id => id !== questionId))
    }
  }

  const filteredQuestions = questions?.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === 'all' || question.subjectId.toString() === subjectFilter
    return matchesSearch && matchesSubject
  }) || []

  const totalQuestions = questions?.length || 0
  const startIndex = currentPage * pageSize + 1
  const endIndex = Math.min((currentPage + 1) * pageSize, totalQuestions)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Questions</h1>
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load questions</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Questions</h1>
        <Button asChild>
          <Link href="/admin/questions/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Question
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedQuestions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedQuestions.length} question(s) selected
              </p>
              <Button variant="destructive" size="sm">
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left font-medium">Question</th>
                  <th className="p-4 text-left font-medium">Subject</th>
                  <th className="p-4 text-left font-medium">Created</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((question) => {
                  const subject = subjects?.find(s => s.id === question.subjectId)
                  return (
                    <tr key={question.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedQuestions.includes(question.id)}
                          onCheckedChange={(checked) => 
                            handleSelectQuestion(question.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <div className="max-w-md">
                          <p className="font-medium">
                            {truncateText(question.text, 100)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {question.choices.length} choices
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {subject?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(question.createdAt)}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/questions/view/${question.id}`}>
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/questions/edit/${question.id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalQuestions > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {startIndex}-{endIndex} of {totalQuestions}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={endIndex >= totalQuestions}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No questions found</p>
        </div>
      )}
    </div>
  )
} 