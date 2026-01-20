'use client';

// Force dynamic rendering to bypass SSG prerender issues with Zustand store
// See: https://github.com/vercel/next.js/issues/85668
export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useJobStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, Cell } from 'recharts';
import {
  Briefcase,
  Send,
  MessageSquare,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  CalendarDays,
} from 'lucide-react';
import { AddJobDialog } from '@/components/jobs/add-job-dialog';
import { useJobStats } from '@/hooks/useJobStats';
import { STATUS_CONFIG } from '@/lib/status';
import { APP_CONFIG } from '@/lib/constants';
import type { JobStatus } from '@/types';

// Chart configuration
const pipelineChartConfig = {
  count: {
    label: 'Jobs',
  },
  saved: { label: 'Saved', color: 'hsl(var(--chart-1))' },
  applied: { label: 'Applied', color: 'hsl(var(--chart-2))' },
  screening: { label: 'Screening', color: 'hsl(var(--chart-3))' },
  interview: { label: 'Interview', color: 'hsl(var(--chart-4))' },
  offer: { label: 'Offer', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;


export default function DashboardPage() {
  const jobs = useJobStore((state) => state.jobs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const stats = useJobStats();

  // Pipeline data for chart
  const pipelineData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      saved: 0,
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
    };

    jobs.forEach((job) => {
      if (job.status === 'saved') statusCounts.saved++;
      else if (job.status === 'applied') statusCounts.applied++;
      else if (job.status === 'screening') statusCounts.screening++;
      else if (['interview', 'technical', 'final'].includes(job.status)) statusCounts.interview++;
      else if (['offer', 'accepted'].includes(job.status)) statusCounts.offer++;
    });

    return [
      { stage: 'Saved', count: statusCounts.saved, fill: 'var(--chart-1)' },
      { stage: 'Applied', count: statusCounts.applied, fill: 'var(--chart-2)' },
      { stage: 'Screening', count: statusCounts.screening, fill: 'var(--chart-3)' },
      { stage: 'Interview', count: statusCounts.interview, fill: 'var(--chart-4)' },
      { stage: 'Offer', count: statusCounts.offer, fill: 'var(--chart-5)' },
    ];
  }, [jobs]);

  // Get recent jobs (last 5)
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  // Get jobs needing action
  const needsAction = jobs.filter(
    (job) => job.next_action && job.next_action_date && new Date(job.next_action_date) <= new Date()
  );

  // Weekly application goal (from app config, could be user-configurable in future)
  const weeklyGoal = APP_CONFIG.GOALS.DEFAULT_WEEKLY_APPLICATIONS;
  const goalProgress = Math.min((stats.appliedThisWeek / weeklyGoal) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your job search command center.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2">
          <Plus className="size-4" />
          Add Job Application
        </Button>
      </div>

      {/* Top Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Jobs */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Jobs
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2">
              <Briefcase className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.saved} saved, {stats.total - stats.saved} in pipeline
            </p>
          </CardContent>
        </Card>

        {/* Applied This Week */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Applied This Week
            </CardTitle>
            <div className="rounded-md bg-chart-2/10 p-2">
              <Send className="size-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.appliedThisWeek}</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={goalProgress} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground">{weeklyGoal} goal</span>
            </div>
          </CardContent>
        </Card>

        {/* Interviewing */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interviewing
            </CardTitle>
            <div className="rounded-md bg-chart-4/10 p-2">
              <MessageSquare className="size-4 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.interviewing}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active interview processes
            </p>
          </CardContent>
        </Card>

        {/* Offers */}
        <Card className={`card-hover ${stats.offers > 0 ? 'ring-2 ring-emerald-500/20' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offers
            </CardTitle>
            <div className={`rounded-md p-2 ${stats.offers > 0 ? 'bg-emerald-500/10' : 'bg-chart-5/10'}`}>
              <Trophy className={`size-4 ${stats.offers > 0 ? 'text-emerald-500' : 'text-chart-5'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stats.offers > 0 ? 'text-emerald-600' : ''}`}>
              {stats.offers}
            </div>
            {stats.offers > 0 && (
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <Sparkles className="size-3" />
                Congratulations!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Chart & Response Rate */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Pipeline Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              Application Pipeline
            </CardTitle>
            <CardDescription>
              Your job applications by stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.total === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Briefcase className="size-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  No applications yet. Start tracking your job hunt!
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
                  <Plus className="mr-2 size-4" />
                  Add your first job
                </Button>
              </div>
            ) : (
              <ChartContainer config={pipelineChartConfig} className="h-[200px] w-full">
                <BarChart
                  data={pipelineData}
                  layout="vertical"
                  margin={{ left: 0, right: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={32}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Response Rate & Goals */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4 text-chart-2" />
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{stats.response_rate}%</span>
                <span className="text-sm text-muted-foreground">of applications</span>
              </div>
              <Progress value={stats.response_rate} className="h-2 mt-3" />
              <p className="text-xs text-muted-foreground mt-2">
                Industry average: 10-15%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="size-4 text-primary" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{stats.appliedThisWeek}</span>
                <span className="text-sm text-muted-foreground">/ {weeklyGoal}</span>
              </div>
              <Progress value={goalProgress} className="h-2 mt-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {weeklyGoal - stats.appliedThisWeek > 0
                  ? `${weeklyGoal - stats.appliedThisWeek} more to reach your goal`
                  : '🎉 Goal achieved!'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity & Needs Action */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest job updates</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/jobs">
                View all
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No jobs tracked yet. Add your first application!
              </p>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{job.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{job.company}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `color-mix(in oklch, ${STATUS_CONFIG[job.status as JobStatus]?.chart ?? 'var(--muted)'} 15%, transparent)`,
                        color: STATUS_CONFIG[job.status as JobStatus]?.chart ?? 'var(--muted-foreground)',
                      }}
                    >
                      {STATUS_CONFIG[job.status as JobStatus]?.label ?? job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Needs Action */}
        <Card className={needsAction.length > 0 ? 'border-amber-500/30' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays
                className={`size-5 ${needsAction.length > 0 ? 'text-amber-500' : 'text-muted-foreground'}`}
              />
              <span className={needsAction.length > 0 ? 'text-amber-600' : ''}>
                Needs Action
              </span>
              {needsAction.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-amber-500/10 text-amber-600">
                  {needsAction.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Jobs requiring follow-up</CardDescription>
          </CardHeader>
          <CardContent>
            {needsAction.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="rounded-full bg-emerald-500/10 p-3 mb-3">
                  <Sparkles className="size-6 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You&apos;re all caught up! No pending actions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {needsAction.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{job.company}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {job.next_action}
                      </p>
                    </div>
                    <Badge variant="destructive" className="shrink-0">
                      Overdue
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide (shown when no jobs) */}
      {jobs.length === 0 && (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Get Started with Your Job Hunt
            </CardTitle>
            <CardDescription>
              Welcome to your Job Hunt Tracker! Here&apos;s how to begin:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: 1, title: 'Add a job', desc: 'Track your first application' },
                { step: 2, title: 'Set up profile', desc: 'Add your resume and preferences' },
                { step: 3, title: 'Track progress', desc: 'Update status as you advance' },
                { step: 4, title: 'Stay organized', desc: 'Add notes for AI assistance' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Add Job Dialog */}
      <AddJobDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
