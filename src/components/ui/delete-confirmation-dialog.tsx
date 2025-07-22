// components/DeleteConfirmationDialog.tsx
'use client'

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DeleteConfirmationDialog({
    isOpen,
    onConfirm,
    onClose,
    itemName = "this item",
}: {
    isOpen: boolean
    onConfirm: () => void
    onClose: () => void
    itemName?: string
}) {
    const [inputValue, setInputValue] = useState("")

    useEffect(() => { setInputValue('') }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-red-500">Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete all the items.
                        <br />
                        Please type <b className="text-red-600">DELETE</b> to confirm.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    name="confirm-delete"
                    placeholder="Type DELETE to confirm"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoComplete="off"
                    className="focus-visible:ring-red-500 focus-active:ring-red-500 text-red-500 border-red-300 placeholder:text-xs placeholder:text-red-300 placeholder-opacity-50"
                />

                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={inputValue !== "DELETE"}
                    >
                        Confirm Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
