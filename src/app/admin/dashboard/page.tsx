"use client"

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { useDashboard } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FolderOpen, Users, Target } from 'lucide-react'
import { useThemeStore } from '@/store/theme'
import Link from 'next/link'

// Count up animation component
const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

export default function DashboardPage() {
  const { data: dashboardData, error, isLoading } = useDashboard()
  const { theme } = useThemeStore()

  // Chart color variables
  const chartBg = theme === 'dark' ? 'var(--card)' : '#fff'
  const chartGrid = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const chartAxis = theme === 'dark' ? 'var(--muted-foreground)' : '#8884d8'
  const chartBar = 'var(--primary)'
  const chartArea = 'var(--primary)'
  const chartTooltipBg = theme === 'dark' ? 'var(--card)' : '#fff'
  const chartTooltipText = theme === 'dark' ? 'var(--foreground)' : '#222'

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Questions",
      value: dashboardData.totalQuestions,
      description: "Questions in the database",
      icon: BookOpen,
    },
    {
      title: "Total Subjects",
      value: dashboardData.totalSubjects,
      description: "Available subjects",
      icon: FolderOpen,
    },
    {
      title: "Total Attempts",
      value: dashboardData.totalAttempts,
      description: "Quiz attempts made",
      icon: Users,
    },
    {
      title: "Success Rate",
      value: dashboardData.totalAttempts > 0
        ? Math.round((dashboardData.totalCorrect / dashboardData.totalAttempts) * 100)
        : 0,
      description: "Correct answers percentage",
      icon: Target,
      suffix: "%",
    },
  ]

  // Prepare chart data
  const subjectChartData = dashboardData.subjectWiseQuestionCounts.map(item => ({
    subject: item.subject,
    questions: item.questionCount,
  }))

  const monthlyData = Object.entries(dashboardData.monthlyNewQuestions).map(([month, count]) => ({
    month,
    questions: count,
  }))

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp end={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Subject-wise Question Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Questions by Subject</CardTitle>
            <CardDescription>
              Distribution of questions across different subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectChartData}
                style={{ background: chartBg }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis
                  dataKey="subject"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  stroke={chartAxis}
                />
                <YAxis stroke={chartAxis} />
                <Tooltip
                  contentStyle={{ background: chartTooltipBg, color: chartTooltipText, border: '1px solid var(--border)' }}
                  itemStyle={{ color: chartTooltipText }}
                  labelStyle={{ color: chartTooltipText }}
                />
                <Bar dataKey="questions" fill={chartBar} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly New Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly New Questions</CardTitle>
            <CardDescription>
              Number of questions added each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}
                style={{ background: chartBg }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  stroke={chartAxis}
                />
                <YAxis stroke={chartAxis} />
                <Tooltip
                  contentStyle={{ background: chartTooltipBg, color: chartTooltipText, border: '1px solid var(--border)' }}
                  itemStyle={{ color: chartTooltipText }}
                  labelStyle={{ color: chartTooltipText }}
                />
                <Area
                  type="monotone"
                  dataKey="questions"
                  stroke={chartArea}
                  fill={chartArea}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Answer Statistics</CardTitle>
            <CardDescription>
              Breakdown of correct vs incorrect answers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Correct Answers</span>
                <span className="text-sm text-green-600">
                  {dashboardData.totalCorrect.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Incorrect Answers</span>
                <span className="text-sm text-red-600">
                  {dashboardData.totalIncorrect.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${dashboardData.totalAttempts > 0
                      ? (dashboardData.totalCorrect / dashboardData.totalAttempts) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link
                href="/admin/questions/add"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="font-medium">Add New Question</div>
                <div className="text-sm text-muted-foreground">Create a new MCQ question</div>
              </Link>
              <Link
                href="/admin/subjects"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="font-medium">Manage Subjects</div>
                <div className="text-sm text-muted-foreground">Add or edit subjects</div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 