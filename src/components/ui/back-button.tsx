'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackButton({ className }: { className?: string }) {
    const router = useRouter();

    return (
        <Button variant="ghost" onClick={() => router.back()} className={cn("flex items-center h-auto gap-1 text-gray-500 dark:text-gray-400 dark:hover:text-gray-100 p-0 hover:bg-transparent", className)}>
            <ArrowLeft className="h-4 w-4" />
            Back
        </Button>
    );
}
