import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen-dynamic flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Hello World</h1>
        <p className="text-muted-foreground max-w-md">
          Welcome to the MCQ Admin Dashboard. This is a comprehensive platform for managing multiple choice questions and subjects.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
