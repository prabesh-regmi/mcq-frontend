"use client";

import React, { useEffect, useState } from "react";
import { useQuestions, useSubjects, adminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Filter } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { AdminQuestion, Subject } from "@/types/api";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function QuestionsPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]); // multi-select
  const router = useRouter();
  const [deleteSubject, setDeleteSubject] = useState<AdminQuestion | null>(
    null
  );

  const { data: subjects } = useSubjects();
  const {
    data: questionsData,
    error,
    isLoading,
    mutate: mutateQuestions,
  } = useQuestions({
    skip: page * 50,
    limit: 50,
    search: searchTerm,
    subjectIds: selectedSubjectIds.length > 0 ? selectedSubjectIds : undefined,
  });
  useEffect(() => {
    mutateQuestions();
  }, []);

  const handleDeleteQuestions = async (selectedQuestions: AdminQuestion[]) => {
    try {
      await adminAPI.bulkDeleteQuestions({
        ids: selectedQuestions.map((q) => q.id),
      });
      toast.success("Questions deleted", {
        description: `${selectedQuestions.length} question(s) deleted successfully.`,
      });
      mutateQuestions();
    } catch (error: any) {
      toast.error("Failed to delete questions", {
        description: error?.message || "An error occurred.",
      });
    }
  };
  const handleDownload = async (
    selectedQuestions: AdminQuestion[],
    type: "csv" | "excel"
  ) => {
    try {
      const blob = await adminAPI.downloadQuestions(
        type,
        selectedSubjectIds.length > 0 ? selectedSubjectIds : [],
        selectedQuestions.map((q) => q.id)
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `questions.${type === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Failed to download questions", {
        description: error?.message || "An error occurred.",
      });
    }
  };

  // DataTable columns with correct API fields
  const columns: {
    accessorKey: keyof AdminQuestion;
    header: string;
    cell?: (data: AdminQuestion) => React.ReactNode;
    headClassName?: string;
    cellClassName?: string;
  }[] = [
    {
      accessorKey: "text",
      header: "Question Text",
      headClassName: "w-[40%] pl-2 md:pl-4",
      cellClassName: "w-[40%] pl-2 md:pl-4",
      cell: (row: AdminQuestion) => <span>{row.text}</span>,
    },
    {
      accessorKey: "subjectName",
      header: "Subject",
      headClassName: "w-[20%]",
      cellClassName: "w-[20%]",
      cell: (row: AdminQuestion) => <span>{row.subjectName}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      headClassName: "w-[20%]",
      cellClassName: "w-[20%]",
      cell: (row: AdminQuestion) => (
        <span>
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "id",
      header: "Actions",
      headClassName: "w-[20%]",
      cellClassName: "w-[20%]",
      cell: (question: AdminQuestion) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="border align-left">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/admin/questions/view?questionId=${question.id}`)
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/admin/questions/edit?questionId=${question.id}`)
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteSubject(question)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Multi-select subject filter for DataTable control bar
  const subjectFilterDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="pl-10 pr-4 py-2 border rounded-md bg-background hover:bg-background data-[state=open]:ring-1 hover:ring-1 ring-primary relative"
        >
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {selectedSubjectIds.length === 0
            ? "All Subjects"
            : `${selectedSubjectIds.length} subject${
                selectedSubjectIds.length > 1 ? "s" : ""
              } selected`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuCheckboxItem
          checked={selectedSubjectIds.length === 0}
          onCheckedChange={() => setSelectedSubjectIds([])}
        >
          All Subjects
        </DropdownMenuCheckboxItem>
        {subjects?.map((subject: Subject) => (
          <DropdownMenuCheckboxItem
            key={subject.id}
            checked={selectedSubjectIds.includes(subject.id)}
            onCheckedChange={(checked) => {
              setSelectedSubjectIds((prev) => {
                if (checked) {
                  return [...prev, subject.id];
                } else {
                  return prev.filter((id) => id !== subject.id);
                }
              });
            }}
          >
            {subject.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Questions</h1>
        <Link href="/admin/questions/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </Link>
      </div>
      <DataTable
        data={questionsData?.data || []}
        columns={columns}
        isFetching={isLoading}
        totalCount={questionsData?.total || 0}
        page={page}
        setPage={setPage}
        onDelete={handleDeleteQuestions}
        onSearch={setSearchTerm}
        onDownload={handleDownload}
        customFilter={subjectFilterDropdown}
        pageSize={50}
      />
      <ConfirmationDialog
        title="Confirm Delete"
        description="Are sure to delete this item?"
        isOpen={!!deleteSubject}
        onClose={() => setDeleteSubject(null)}
        onConfirm={() =>
          deleteSubject && handleDeleteQuestions([deleteSubject])
        }
      />
    </div>
  );
}
