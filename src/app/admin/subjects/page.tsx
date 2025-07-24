"use client";

import React, { useState } from "react";
import { useSubjects, adminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { formatDate } from "@/lib/utils";
import { Subject } from "@/types/api";
import { toast } from "sonner";

export default function SubjectsPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const {
    data: subjects,
    isLoading,
    mutate: mutateSubjects,
  } = useSubjects({ skip: page * 10, limit: 100 });

  const handleAddOrUpdateSubject = async () => {
    if (!newSubjectName.trim()) return;
    setIsCreating(true);
    try {
      if (editingSubject) {
        await adminAPI.updateSubject(editingSubject.id, {
          name: newSubjectName,
        });
        toast.success("Subject updated", {
          description: `Subject was updated successfully.`,
        });
      } else {
        await adminAPI.createSubject({ name: newSubjectName });
        toast.success("Subject created", {
          description: `Subject was created successfully.`,
        });
      }
      setNewSubjectName("");
      setEditingSubject(null);
      mutateSubjects();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Failed to ${editingSubject ? "update" : "create"} subject`, {
        description: error?.message || "An error occurred.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;
    try {
      await adminAPI.deleteSubject(deletingSubject.id);
      toast.success("Subject deleted", {
        description: `Subject deleted successfully.`,
      });
      mutateSubjects();
    } catch (error: any) {
      toast.error("Failed to delete subject", {
        description: error?.message || "An error occurred.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingSubject(null);
    }
  };
  const handleDeleteSubjects = async (selectedSubjects: Subject[]) => {
    try {
      await Promise.all(
        selectedSubjects.map((s) => adminAPI.deleteSubject(s.id))
      );
      toast.success("Subjects deleted", {
        description: `${selectedSubjects.length} subject(s) deleted successfully.`,
      });
      mutateSubjects();
    } catch (error: any) {
      toast.error("Failed to delete subjects", {
        description: error?.message || "An error occurred.",
      });
    }
  };
  const columns: {
    accessorKey: keyof Subject;
    header: string;
    cell?: (data: Subject) => React.ReactNode;
    headClassName?: string;
    cellClassName?: string;
  }[] = [
    {
      accessorKey: "name",
      header: "Subject Name",
      headClassName: "w-[40%] pl-2 md:pl-4",
      cellClassName: "w-[40%] pl-2 md:pl-4",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      headClassName: "w-[30%]",
      cellClassName: "w-[30%]",
      cell: (subject) => formatDate(subject.createdAt),
    },
    {
      accessorKey: "id",
      header: "Actions",
      headClassName: "w-[30%]",
      cellClassName: "w-[30%]",
      cell: (subject) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingSubject(subject);
              setNewSubjectName(subject.name);
              setIsDialogOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-600 hover:text-white"
            size="sm"
            onClick={() => {
              setDeletingSubject(subject);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredSubjects =
    subjects?.filter((subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Button
          onClick={() => {
            setNewSubjectName("");
            setEditingSubject(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter subject name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddOrUpdateSubject} disabled={isCreating}>
              {isCreating
                ? editingSubject
                  ? "Saving..."
                  : "Adding..."
                : editingSubject
                ? "Save"
                : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{deletingSubject?.name}</span>?
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDeleteSubject} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        data={filteredSubjects}
        columns={columns}
        isFetching={isLoading}
        totalCount={subjects?.length || 0}
        page={page}
        setPage={setPage}
        onSearch={setSearchTerm}
        onDelete={handleDeleteSubjects}
      />
    </div>
  );
}
