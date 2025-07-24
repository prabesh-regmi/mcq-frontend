"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderOpen,
  Users,
  Target,
  Plus,
  Settings,
  Grid,
  Command,
  Briefcase,
  PlusCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useDashboard } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";

const CountUp = ({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function DashboardPage() {
  const { data: dashboardData, error, isLoading } = useDashboard();
  const { theme } = useTheme();

  const chartGrid =
    theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const chartAxis =
    theme === "dark" ? "hsl(var(--muted-foreground))" : "#8884d8";
  const chartBar = "hsl(var(--primary))";
  const chartArea = "hsl(var(--primary))";
  const chartTooltipBg = theme === "dark" ? "hsl(var(--card))" : "#fff";
  const chartTooltipText = theme === "dark" ? "hsl(var(--foreground))" : "#222";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Loading...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
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
      value:
        dashboardData.totalAttempts > 0
          ? Math.round(
              (dashboardData.totalCorrect / dashboardData.totalAttempts) * 100
            )
          : 0,
      description: "Correct answers percentage",
      icon: Target,
      suffix: "%",
    },
  ];

  const subjectChartData = dashboardData.subjectWiseQuestionCounts.map(
    (item) => ({
      subject: item.subject,
      questions: item.questionCount,
    })
  );

  const monthlyData = Object.entries(dashboardData.monthlyNewQuestions).map(
    ([month, count]) => ({
      month,
      questions: count,
    })
  );

  const totalCorrectAttemptPercentage =
    dashboardData.totalAttempts > 0 ? (1 / 2) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp end={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Questions by Subject</CardTitle>
            <CardDescription>
              Distribution of questions across different subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-card rounded-md">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectChartData}>
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
                  contentStyle={{
                    background: chartTooltipBg,
                    color: chartTooltipText,
                    border: "1px solid var(--border)",
                  }}
                  itemStyle={{ color: chartTooltipText }}
                  labelStyle={{ color: chartTooltipText }}
                />
                <Bar dataKey="questions" fill={chartBar} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly New Questions</CardTitle>
            <CardDescription>
              Number of questions added each month
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-card rounded-md">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
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
                  contentStyle={{
                    background: chartTooltipBg,
                    color: chartTooltipText,
                    border: "1px solid var(--border)",
                  }}
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
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>Correct Answer Percentage</span>
                  <span>{Math.round(totalCorrectAttemptPercentage)}%</span>
                </div>
                <Progress value={totalCorrectAttemptPercentage} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link
                href="/admin/questions/add"
                className="block p-3 rounded-lg border border-primary bg-primary hover:bg-primary/90 text-primary-foreground transition-colors flex items-center gap-2"
              >
                <PlusCircle className="size-8  mr-2" />
                <div>
                  <div className="font-medium">Add New Question</div>
                  <div className="text-sm">Create a new MCQ question</div>
                </div>
              </Link>
              <Link
                href="/admin/subjects"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors flex items-center gap-2"
              >
                <Briefcase className="size-8 text-muted-foreground mr-2" />
                <div>
                  <div className="font-medium">Manage Subjects</div>
                  <div className="text-sm text-muted-foreground">
                    Add or edit subjects
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
