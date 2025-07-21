"use client"

import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { adminAPI, useSubjects } from '@/lib/api';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CheckCircle2Icon, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const BulkUpload = () => {
    const { data: subjects } = useSubjects();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [editData, setEditData] = useState<any>(null);
    const [confirming, setConfirming] = useState(false);
    const [success, setSuccess] = useState(false);
    const [createdCount, setCreatedCount] = useState(0);
    const [downloading, setDownloading] = useState<'csv' | 'excel' | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
    const [showDeleteSelectedDialog, setShowDeleteSelectedDialog] = useState(false);

    const onDrop = React.useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        setFileError(null);
        if (acceptedFiles && acceptedFiles.length > 0) {
            const f = acceptedFiles[0];
            if (f.size > MAX_FILE_SIZE) {
                setFileError('File size exceeds 5MB. Please upload a smaller file.');
                setFile(null);
                return;
            }
            setFile(f);
        } else if (fileRejections && fileRejections.length > 0) {
            setFileError('File is not accepted. Please upload a valid CSV or Excel file.');
            setFile(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        multiple: false,
        maxSize: MAX_FILE_SIZE,
    });

    const handlePreview = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const res = await adminAPI.previewFile(file);
            setPreview(res);
            setStep(2);
            setSelectedRows([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRow = (idx: number, checked: boolean) => {
        setSelectedRows(prev => checked ? [...prev, idx] : prev.filter(i => i !== idx));
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked && preview?.questions) {
            setSelectedRows(preview.questions.map((_: any, i: number) => i));
        } else {
            setSelectedRows([]);
        }
    };

    const handleDeleteRows = () => {
        setShowDeleteSelectedDialog(true);
    };
    const confirmDeleteRows = () => {
        setPreview((prev: any) => ({
            ...prev,
            questions: prev.questions.filter((_: any, i: number) => !selectedRows.includes(i)),
        }));
        setSelectedRows([]);
        setShowDeleteSelectedDialog(false);
    };

    const handleSingleDelete = (idx: number) => {
        setPreview((prev: any) => ({
            ...prev,
            questions: prev.questions.filter((_: any, i: number) => i !== idx),
        }));
        setSelectedRows(selectedRows.filter(i => i !== idx));
        setDeleteIdx(null);
    };

    const handleEdit = (idx: number) => {
        const question = preview.questions[idx];
        // If subject is an id, convert to name
        let subjectName = question.subject;
        if (subjects && typeof question.subject === 'number') {
            const found = subjects.find((s) => s.id === question.subject);
            if (found) subjectName = found.name;
        }
        setEditIdx(idx);
        setEditData({ ...question, subject: subjectName });
    };

    const handleEditChange = (field: string, value: any) => {
        setEditData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleEditChoiceChange = (cidx: number, field: string, value: any) => {
        setEditData((prev: any) => ({
            ...prev,
            choices: prev.choices.map((c: any, i: number) => i === cidx ? { ...c, [field]: value } : c),
        }));
    };

    const handleEditSave = () => {
        setPreview((prev: any) => ({
            ...prev,
            questions: prev.questions.map((q: any, i: number) => i === editIdx ? editData : q),
        }));
        setEditIdx(null);
        setEditData(null);
    };

    const handleConfirm = async () => {
        setConfirming(true);
        try {
            await adminAPI.bulkCreateQuestions({
                questions: preview.questions,
                newSubjects: Array.isArray(preview.newSubjects) ? preview.newSubjects : [],
            });
            setSuccess(true);
            setCreatedCount(preview.questions.length);
            setStep(1);
            setPreview(null);
            setFile(null);
        } finally {
            setConfirming(false);
        }
    };

    const handleDownloadTemplate = async (type: 'csv' | 'excel') => {
        setDownloading(type);
        try {
            const blob = await adminAPI.downloadFileTemplate(type);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `question-template.${type === 'csv' ? 'csv' : 'xlsx'}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="space-y-4">
            {step === 1 && (
                <>
                    <div className="flex gap-2 mb-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate('csv')} disabled={!!downloading}>
                            {downloading === 'csv' ? 'Downloading...' : 'Download CSV Template'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate('excel')} disabled={!!downloading}>
                            {downloading === 'excel' ? 'Downloading...' : 'Download Excel Template'}
                        </Button>
                    </div>
                    <div {...getRootProps()} className={
                        `border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted/30 hover:bg-muted/40'}`
                    }>
                        <input {...getInputProps()} />
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-base font-medium">{file.name}</span>
                                <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); setFile(null); }}>Remove</Button>
                            </div>
                        ) : (
                            <>
                                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mb-2 text-muted-foreground"><path d="M12 16v-8m0 0l-4 4m4-4l4 4" /><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                                <span className="text-base font-medium">Drag & drop a CSV or Excel file here, or click to select</span>
                                <span className="text-xs text-muted-foreground mt-1">Supported: .csv, .xlsx, .xls &middot; Max size: 5MB</span>
                            </>
                        )}
                    </div>
                    {fileError && <div className="text-destructive text-sm text-center mt-2">{fileError}</div>}
                    <Button onClick={handlePreview} disabled={!file || loading || !!fileError} className="w-full">
                        {loading ? 'Loading...' : 'Preview'}
                    </Button>
                </>
            )}

            {step === 2 && preview && (
                <div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Preview Questions</h2>
                    </div>
                    {Array.isArray(preview.newSubjects) && preview.newSubjects.length > 0 && (
                        <>
                            <Alert className='max-w-sm pr-16 mb-4 gap-2 text-primary'>
                                <CheckCircle2Icon />
                                <AlertTitle >The following new subjects will be created:</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc list-inside text-sm">
                                        {preview.newSubjects.map((sub: string) => (
                                            <li key={sub}>{sub}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </>
                    )}
                    {preview?.detail ? (
                        <div className="text-center text-destructive py-8 font-medium">There was an error processing your file. Please check your template and data.<br />{preview.detail}</div>
                    ) : (!preview?.questions || preview.questions.length === 0) ? (
                        <div className="text-center text-muted-foreground py-8">No questions found in the uploaded file. Please check your template and data.</div>
                    ) : (
                        <div className="relative">
                            {/* Sticky Table Header */}
                            <div
                                className="sticky top-16 z-30 bg-muted"
                            >
                                <table className="w-full border text-sm table-fixed">
                                    <thead>
                                        <tr>
                                            <th className="p-4 text-left border-b w-12">
                                                <Checkbox checked={selectedRows.length === (preview?.questions?.length || 0) && preview?.questions?.length > 0} onCheckedChange={handleSelectAll} />
                                            </th>
                                            <th className="p-4 text-left border-b w-1/4">Question</th>
                                            <th className="p-4 text-left border-b w-1/6">Subject</th>
                                            <th className="p-4 text-left border-b w-1/3">Choices</th>
                                            <th className="p-4 text-left border-b w-32">Actions</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            {/* Scrollable Table Body */}
                            <div className="overflow-x-auto">
                                <table className="w-full border text-sm table-fixed">
                                    <tbody>
                                        {preview?.questions?.map((q: any, idx: number) => (
                                            <tr key={idx} className="border-b hover:bg-muted">
                                                <td className="p-4 w-12"><Checkbox checked={selectedRows.includes(idx)} onCheckedChange={checked => handleSelectRow(idx, checked as boolean)} /></td>
                                                <td className="p-4 max-w-xs whitespace-pre-wrap w-1/4">{q.text}</td>
                                                <td className="p-4 w-1/6">{q.subject}</td>
                                                <td className="p-4 w-1/3">
                                                    <ul className="list-disc pl-4">
                                                        {q.choices.map((c: any, cidx: number) => {
                                                            const isCorrect = c.isCorrect ?? c.is_correct;
                                                            return (
                                                                <li key={cidx} className={isCorrect ? 'font-semibold text-green-700' : ''}>{c.text}{isCorrect && ' (Correct)'}</li>
                                                            );
                                                        })}
                                                    </ul>
                                                </td>
                                                <td className="p-4 flex gap-2 items-center w-32">
                                                    <Tooltip.Provider delayDuration={0}><Tooltip.Root><Tooltip.Trigger asChild>
                                                        <Button variant="outline" size="icon" onClick={() => handleEdit(idx)}><span className="sr-only">Edit</span><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a4 4 0 0 1-2.828 1.172H7v-2a4 4 0 0 1 1.172-2.828z" /></svg></Button>
                                                    </Tooltip.Trigger><Tooltip.Content side="top">Edit</Tooltip.Content></Tooltip.Root></Tooltip.Provider>
                                                    <DropdownMenu open={deleteIdx === idx} onOpenChange={open => setDeleteIdx(open ? idx : null)}>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="icon"><Trash className="w-4 h-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem className="text-destructive" onClick={() => handleSingleDelete(idx)}>
                                                                Confirm Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="sticky bottom-0 bg-background p-4 z-10 flex justify-between items-center border-t">
                        <div>
                            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                            <Button variant="outline" onClick={handleDeleteRows} disabled={selectedRows.length === 0} className="ml-2 border-red-400 text-red-400 hover:bg-red-50 hover:text-red-400 dark:hover:bg-red-950 dark:hover:text-white">Delete Selected</Button>
                        </div>
                        <Button onClick={handleConfirm} disabled={confirming || !!preview?.detail || !preview?.questions || preview.questions.length === 0}>
                            {confirming ? 'Confirming...' : 'Confirm & Upload'}
                        </Button>
                    </DialogFooter>

                    <Dialog open={editIdx !== null} onOpenChange={open => { if (!open) setEditIdx(null); }}>
                        <DialogContent className="max-w-lg w-full">
                            <DialogHeader><DialogTitle>Edit Question</DialogTitle></DialogHeader>
                            {editData && (
                                <div className="space-y-4">
                                    <Input value={editData.text} onChange={e => handleEditChange('text', e.target.value)} placeholder="Question text" />
                                    <Input
                                        value={editData.subject}
                                        readOnly
                                        className="w-full border rounded px-2 py-2 bg-background"
                                        placeholder="Subject"
                                    />
                                    <div>
                                        <div className="font-medium mb-2">Choices</div>
                                        <div className="space-y-2">
                                            {editData.choices.map((choice: any, cidx: number) => (
                                                <div key={cidx} className="flex items-center gap-2">
                                                    <Input
                                                        value={choice.text}
                                                        onChange={e => handleEditChoiceChange(cidx, 'text', e.target.value)}
                                                        placeholder={`Choice ${cidx + 1}`}
                                                        className="flex-1"
                                                    />
                                                    <Checkbox
                                                        checked={choice.isCorrect}
                                                        onCheckedChange={() => setEditData((prev: any) => ({
                                                            ...prev,
                                                            choices: prev.choices.map((c: any, i: number) => ({ ...c, isCorrect: i === cidx })),
                                                        }))}
                                                        className="ml-2"
                                                    />
                                                    <span className="text-xs">Correct</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button onClick={handleEditSave}>Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            {/* Success Dialog */}
            <Dialog open={success} onOpenChange={setSuccess}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Bulk Upload Success</DialogTitle></DialogHeader>
                    <div>{createdCount} questions created successfully.</div>
                    <DialogFooter>
                        <Button onClick={() => setSuccess(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={showDeleteSelectedDialog} onOpenChange={setShowDeleteSelectedDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
                    <div className="py-4 text-destructive font-medium">Are you sure you want to delete the selected questions? This action cannot be undone.</div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteSelectedDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDeleteRows}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default BulkUpload;