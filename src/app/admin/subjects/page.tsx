"use client"

import React, { useState } from 'react';
import { useSubjects, adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MoreHorizontal, Search } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { toast } from '@/hooks/use-toast';
import { mutate } from 'swr';
import { formatDate } from '@/lib/utils';
import { Subject } from '@/types/api';

export default function SubjectsPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { data: subjects, error, isLoading } = useSubjects({
    skip: page * 10,
    limit: 10,
  });

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    setIsCreating(true);
    try {
      await adminAPI.createSubject({ name: newSubjectName });
      setNewSubjectName('');
      toast({
        title: 'Subject created',
        description: `Subject "${newSubjectName}" was created successfully.`,
      });
      mutate('/admin/subjects');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Failed to create subject',
        description: error?.message || 'An error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSubjects = async (selectedSubjects: Subject[]) => {
    try {
      await Promise.all(selectedSubjects.map(s => adminAPI.deleteSubject(s.id)));
      toast({
        title: 'Subjects deleted',
        description: `${selectedSubjects.length} subject(s) deleted successfully.`,
      });
      mutate('/admin/subjects');
    } catch (error: any) {
      toast({
        title: 'Failed to delete subjects',
        description: error?.message || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const columns: { accessorKey: keyof Subject; header: string; cell?: (data: Subject) => React.ReactNode; }[] = [
    {
      accessorKey: 'name',
      header: 'Subject Name',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: (subject: Subject) => formatDate(subject.createdAt),
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: (subject: Subject) => (
        <MoreHorizontal className="h-4 w-4" />
      ),
    },
  ];

  const filteredSubjects = subjects?.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter subject name"
              value={newSubjectName}
              onChange={e => setNewSubjectName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddSubject} disabled={isCreating}>
              {isCreating ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        data={filteredSubjects}
        columns={columns}
        isFetching={isLoading}
        totalCount={subjects?.length || 0}
        page={page}
        setPage={setPage}
        onDelete={handleDeleteSubjects}
      />
    </div>
  );
} 