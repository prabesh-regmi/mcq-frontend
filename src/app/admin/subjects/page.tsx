"use client"

import React, { useState } from 'react'
import { useSubjects } from '@/lib/api'
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
import { Plus, MoreHorizontal, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function SubjectsPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')

  const { data: subjects, error, isLoading } = useSubjects()

  const handleSelectAll = (checked: boolean) => {
    if (checked && subjects) {
      setSelectedSubjects(subjects.map(s => s.id))
    } else {
      setSelectedSubjects([])
    }
  }

  const handleSelectSubject = (subjectId: number, checked: boolean) => {
    if (checked) {
      setSelectedSubjects(prev => [...prev, subjectId])
    } else {
      setSelectedSubjects(prev => prev.filter(id => id !== subjectId))
    }
  }

  const filteredSubjects = subjects?.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return
    
    try {
      // TODO: Implement add subject API call
      console.log('Adding subject:', newSubjectName)
      setNewSubjectName('')
      setIsAddingSubject(false)
    } catch (error) {
      console.error('Failed to add subject:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subjects</h1>
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
        <p className="text-muted-foreground">Failed to load subjects</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Button onClick={() => setIsAddingSubject(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {/* Add Subject Form */}
      {isAddingSubject && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter subject name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
              />
              <Button onClick={handleAddSubject}>Add</Button>
              <Button variant="outline" onClick={() => {
                setIsAddingSubject(false)
                setNewSubjectName('')
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedSubjects.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedSubjects.length} subject(s) selected
              </p>
              <Button variant="destructive" size="sm">
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={selectedSubjects.length === filteredSubjects.length && filteredSubjects.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left font-medium">Subject Name</th>
                  <th className="p-4 text-left font-medium">Created</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedSubjects.includes(subject.id)}
                        onCheckedChange={(checked) => 
                          handleSelectSubject(subject.id, checked as boolean)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{subject.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(subject.createdAt)}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No subjects found</p>
        </div>
      )}
    </div>
  )
} 