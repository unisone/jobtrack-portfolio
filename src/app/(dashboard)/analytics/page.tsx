'use client';

// Force dynamic rendering to bypass SSG prerender issues with Zustand store
// See: https://github.com/vercel/next.js/issues/85668
export const dynamic = 'force-dynamic';

import { useMemo } from 'react';
import { useJobStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Job, JobStatus } from '@/types';
import { STATUS_CONFIG } from '@/lib/status';
import { getStartOfWeek, formatWeekLabel, daysBetween } from '@/lib/date-utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  PieChart,
  Clock,
  Building2,
  Filter,
  Calendar,
  ArrowRight,
  Activity,
} from 'lucide-react';

// ----- Type Definitions -----

interface FunnelStage {
  key: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface StatusBreakdown {
  status: JobStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface WeeklyData {
  week: string;
  startDate: Date;
  applied: number;
  responses: number;
}

interface CompanyData {
  company: string;
  count: number;
  statuses: JobStatus[];
}

interface StageTime {
  stage: string;
  avgDays: number;
  color: string;
}

// ----- Helper Functions -----

function getStatusColor(status: JobStatus): string {
  // Map status config to simple background colors for charts
  const chartColors: Record<JobStatus, string> = {
    saved: 'bg-slate-400',
    applied: 'bg-blue-500',
    screening: 'bg-amber-500',
    interview: 'bg-orange-500',
    technical: 'bg-violet-500',
    final: 'bg-indigo-500',
    offer: 'bg-emerald-500',
    accepted: 'bg-emerald-600',
    rejected: 'bg-red-500',
    withdrawn: 'bg-gray-500',
  };
  return chartColors[status] || 'bg-gray-400';
}

function getStatusLabel(status: JobStatus): string {
  return STATUS_CONFIG[status]?.label || status;
}

// ----- Analytics Calculations Hook -----

function useAnalytics(jobs: Job[]) {
  return useMemo(() => {
    // Funnel data
    const savedCount = jobs.length;
    const appliedJobs = jobs.filter((j) => j.status !== 'saved');
    const appliedCount = appliedJobs.length;
    const interviewingJobs = jobs.filter((j) =>
      ['screening', 'interview', 'technical', 'final', 'offer', 'accepted'].includes(j.status)
    );
    const interviewingCount = interviewingJobs.length;
    const offerJobs = jobs.filter((j) => ['offer', 'accepted'].includes(j.status));
    const offerCount = offerJobs.length;

    const funnel: FunnelStage[] = [
      {
        key: 'saved',
        label: 'Saved',
        count: savedCount,
        percentage: 100,
        color: 'bg-slate-400',
      },
      {
        key: 'applied',
        label: 'Applied',
        count: appliedCount,
        percentage: savedCount > 0 ? Math.round((appliedCount / savedCount) * 100) : 0,
        color: 'bg-blue-500',
      },
      {
        key: 'interview',
        label: 'Interview',
        count: interviewingCount,
        percentage: appliedCount > 0 ? Math.round((interviewingCount / appliedCount) * 100) : 0,
        color: 'bg-yellow-500',
      },
      {
        key: 'offer',
        label: 'Offer',
        count: offerCount,
        percentage: interviewingCount > 0 ? Math.round((offerCount / interviewingCount) * 100) : 0,
        color: 'bg-green-500',
      },
    ];

    // Status breakdown
    const statusCounts = jobs.reduce(
      (acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      },
      {} as Record<JobStatus, number>
    );

    const statusBreakdown: StatusBreakdown[] = (Object.keys(statusCounts) as JobStatus[])
      .map((status) => ({
        status,
        label: getStatusLabel(status),
        count: statusCounts[status],
        percentage: jobs.length > 0 ? Math.round((statusCounts[status] / jobs.length) * 100) : 0,
        color: getStatusColor(status),
      }))
      .sort((a, b) => b.count - a.count);

    // Weekly trends (last 8 weeks)
    const now = new Date();
    const eightWeeksAgo = new Date(now);
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const weeklyMap = new Map<string, WeeklyData>();
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      const ws = getStartOfWeek(weekStart);
      const key = ws.toISOString().split('T')[0];
      weeklyMap.set(key, {
        week: formatWeekLabel(ws),
        startDate: ws,
        applied: 0,
        responses: 0,
      });
    }

    jobs.forEach((job) => {
      if (job.applied_date) {
        const appliedDate = new Date(job.applied_date);
        if (appliedDate >= eightWeeksAgo) {
          const weekStart = getStartOfWeek(appliedDate);
          const key = weekStart.toISOString().split('T')[0];
          const weekData = weeklyMap.get(key);
          if (weekData) {
            weekData.applied++;
            if (
              ['screening', 'interview', 'technical', 'final', 'offer', 'accepted', 'rejected'].includes(
                job.status
              )
            ) {
              weekData.responses++;
            }
          }
        }
      }
    });

    const weeklyTrends = Array.from(weeklyMap.values())
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(-8);

    const maxApplied = Math.max(...weeklyTrends.map((w) => w.applied), 1);

    // Response rate over time
    const currentWeekApplied = weeklyTrends[weeklyTrends.length - 1]?.applied || 0;
    const previousWeekApplied = weeklyTrends[weeklyTrends.length - 2]?.applied || 0;
    const weekOverWeekChange =
      previousWeekApplied > 0
        ? Math.round(((currentWeekApplied - previousWeekApplied) / previousWeekApplied) * 100)
        : 0;

    // Overall response rate
    const totalApplied = jobs.filter((j) => j.status !== 'saved').length;
    const totalResponses = jobs.filter((j) =>
      ['screening', 'interview', 'technical', 'final', 'offer', 'accepted', 'rejected'].includes(j.status)
    ).length;
    const overallResponseRate = totalApplied > 0 ? Math.round((totalResponses / totalApplied) * 100) : 0;

    // Top companies
    const companyMap = new Map<string, { count: number; statuses: JobStatus[] }>();
    jobs.forEach((job) => {
      const existing = companyMap.get(job.company);
      if (existing) {
        existing.count++;
        existing.statuses.push(job.status);
      } else {
        companyMap.set(job.company, { count: 1, statuses: [job.status] });
      }
    });

    const topCompanies: CompanyData[] = Array.from(companyMap.entries())
      .map(([company, data]) => ({
        company,
        count: data.count,
        statuses: data.statuses,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Average time in each stage
    const stageTransitions = new Map<string, number[]>();

    jobs.forEach((job) => {
      const createdDate = new Date(job.created_at);
      const appliedDate = job.applied_date ? new Date(job.applied_date) : null;
      const updatedDate = new Date(job.updated_at);

      if (appliedDate && job.status !== 'saved') {
        const daysToApply = daysBetween(createdDate, appliedDate);
        const existing = stageTransitions.get('saved-to-applied') || [];
        existing.push(daysToApply);
        stageTransitions.set('saved-to-applied', existing);
      }

      if (['screening', 'interview', 'technical', 'final', 'offer', 'accepted', 'rejected'].includes(job.status)) {
        if (appliedDate) {
          const daysToResponse = daysBetween(appliedDate, updatedDate);
          const existing = stageTransitions.get('applied-to-response') || [];
          existing.push(daysToResponse);
          stageTransitions.set('applied-to-response', existing);
        }
      }

      if (['offer', 'accepted'].includes(job.status)) {
        if (appliedDate) {
          const daysToOffer = daysBetween(appliedDate, updatedDate);
          const existing = stageTransitions.get('applied-to-offer') || [];
          existing.push(daysToOffer);
          stageTransitions.set('applied-to-offer', existing);
        }
      }
    });

    const avgStageTime: StageTime[] = [
      {
        stage: 'Save to Apply',
        avgDays: calculateAverage(stageTransitions.get('saved-to-applied') || []),
        color: 'bg-blue-500',
      },
      {
        stage: 'Apply to Response',
        avgDays: calculateAverage(stageTransitions.get('applied-to-response') || []),
        color: 'bg-yellow-500',
      },
      {
        stage: 'Apply to Offer',
        avgDays: calculateAverage(stageTransitions.get('applied-to-offer') || []),
        color: 'bg-green-500',
      },
    ];

    function calculateAverage(arr: number[]): number {
      if (arr.length === 0) return 0;
      return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }

    return {
      funnel,
      statusBreakdown,
      weeklyTrends,
      maxApplied,
      weekOverWeekChange,
      overallResponseRate,
      topCompanies,
      avgStageTime,
      totalJobs: jobs.length,
    };
  }, [jobs]);
}

// ----- Components -----

function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div key={stage.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{stage.label}</span>
              {index > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({stage.percentage}% conversion)
                </span>
              )}
            </div>
            <span className="text-sm font-semibold">{stage.count}</span>
          </div>
          <div className="relative h-8 w-full rounded-md bg-muted overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full ${stage.color} transition-all duration-500 ease-out rounded-md`}
              style={{ width: `${(stage.count / maxCount) * 100}%` }}
            />
          </div>
          {index < stages.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBarChart({ data }: { data: StatusBreakdown[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.status} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${item.color}`} />
              <span>{item.label}</span>
            </div>
            <span className="font-medium">
              {item.count} ({item.percentage}%)
            </span>
          </div>
          <div className="relative h-4 w-full rounded-sm bg-muted overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full ${item.color} transition-all duration-300`}
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusPieChart({ data }: { data: StatusBreakdown[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Calculate cumulative percentages for pie slices
  let cumulative = 0;
  const slices = data.map((item) => {
    const start = cumulative;
    const percent = total > 0 ? (item.count / total) * 100 : 0;
    cumulative += percent;
    return { ...item, start, percent };
  });

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
      {/* Pie Chart Visualization */}
      <div
        className="relative h-48 w-48 rounded-full"
        style={{
          background:
            total > 0
              ? `conic-gradient(${slices
                  .map((s) => {
                    const colorMap: Record<string, string> = {
                      'bg-slate-400': '#94a3b8',
                      'bg-blue-500': '#3b82f6',
                      'bg-cyan-500': '#06b6d4',
                      'bg-yellow-500': '#eab308',
                      'bg-orange-500': '#f97316',
                      'bg-purple-500': '#a855f7',
                      'bg-green-500': '#22c55e',
                      'bg-emerald-600': '#059669',
                      'bg-red-500': '#ef4444',
                      'bg-gray-500': '#6b7280',
                    };
                    const hex = colorMap[s.color] || '#6b7280';
                    return `${hex} ${s.start}% ${s.start + s.percent}%`;
                  })
                  .join(', ')})`
              : '#e5e7eb',
        }}
      >
        <div className="absolute inset-4 flex items-center justify-center rounded-full bg-background">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${item.color} shrink-0`} />
            <span className="text-sm">
              {item.label}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyTrendChart({
  data,
  maxValue,
}: {
  data: WeeklyData[];
  maxValue: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((week, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <div className="flex w-full flex-col items-center gap-1 h-32 justify-end">
              {/* Applied bar */}
              <div
                className="w-3/4 max-w-8 bg-blue-500 rounded-t transition-all duration-300"
                style={{
                  height: `${Math.max((week.applied / maxValue) * 100, week.applied > 0 ? 8 : 0)}%`,
                }}
                title={`Applied: ${week.applied}`}
              />
            </div>
            <span className="text-xs text-muted-foreground text-center whitespace-nowrap">
              {week.week}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-blue-500" />
          <span>Applications</span>
        </div>
      </div>
    </div>
  );
}

function ResponseRateTrendChart({ data }: { data: WeeklyData[] }) {
  const rates = data.map((week) =>
    week.applied > 0 ? Math.round((week.responses / week.applied) * 100) : 0
  );
  const maxRate = Math.max(...rates, 100);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((week, index) => {
          const rate = week.applied > 0 ? Math.round((week.responses / week.applied) * 100) : 0;
          return (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-col items-center justify-end h-24">
                <div
                  className="w-3/4 max-w-8 bg-green-500 rounded-t transition-all duration-300"
                  style={{
                    height: `${Math.max((rate / maxRate) * 100, rate > 0 ? 8 : 0)}%`,
                  }}
                  title={`Response rate: ${rate}%`}
                />
              </div>
              <span className="text-xs font-medium">{rate}%</span>
              <span className="text-xs text-muted-foreground">{week.week}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopCompaniesChart({ companies }: { companies: CompanyData[] }) {
  const maxCount = Math.max(...companies.map((c) => c.count), 1);

  if (companies.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No companies tracked yet. Start adding job applications to see your top companies.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {companies.map((company, index) => (
        <div key={company.company} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground w-5">
                {index + 1}.
              </span>
              <span className="text-sm font-medium truncate max-w-[200px]">
                {company.company}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {company.statuses.slice(0, 3).map((status, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-xs px-1.5 py-0"
                >
                  {getStatusLabel(status)}
                </Badge>
              ))}
              {company.statuses.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{company.statuses.length - 3}
                </span>
              )}
              <span className="text-sm font-semibold ml-2">{company.count}</span>
            </div>
          </div>
          <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${(company.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StageTimeChart({ stages }: { stages: StageTime[] }) {
  const maxDays = Math.max(...stages.map((s) => s.avgDays), 1);

  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <div key={stage.stage} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{stage.stage}</span>
            <span className="text-sm font-semibold">
              {stage.avgDays > 0 ? `${stage.avgDays} days` : 'N/A'}
            </span>
          </div>
          <div className="relative h-6 w-full rounded-md bg-muted overflow-hidden">
            {stage.avgDays > 0 && (
              <div
                className={`absolute left-0 top-0 h-full ${stage.color} transition-all duration-500 rounded-md flex items-center justify-end pr-2`}
                style={{ width: `${Math.max((stage.avgDays / maxDays) * 100, 15)}%` }}
              >
                <Clock className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>
      ))}
      {stages.every((s) => s.avgDays === 0) && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Not enough data to calculate average times yet.
        </p>
      )}
    </div>
  );
}

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="flex items-center text-sm text-green-600">
        <TrendingUp className="h-4 w-4 mr-1" />
        +{value}%
      </span>
    );
  } else if (value < 0) {
    return (
      <span className="flex items-center text-sm text-red-600">
        <TrendingDown className="h-4 w-4 mr-1" />
        {value}%
      </span>
    );
  }
  return (
    <span className="flex items-center text-sm text-muted-foreground">
      <Minus className="h-4 w-4 mr-1" />
      0%
    </span>
  );
}

// ----- Main Page Component -----

export default function AnalyticsPage() {
  const jobs = useJobStore((state) => state.jobs);
  const analytics = useAnalytics(jobs);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights and trends from your job search activity.
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-3xl">{analytics.totalJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across all stages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Response Rate</CardDescription>
            <CardTitle className="text-3xl">{analytics.overallResponseRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analytics.overallResponseRate} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-3xl">
              {analytics.weeklyTrends[analytics.weeklyTrends.length - 1]?.applied || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">vs last week</span>
              <TrendIndicator value={analytics.weekOverWeekChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Interview Rate</CardDescription>
            <CardTitle className="text-3xl">
              {analytics.funnel[2]?.percentage || 0}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Of applications that got interviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Application Funnel */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Application Funnel
            </CardTitle>
            <CardDescription>
              Track conversion rates through each stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelChart stages={analytics.funnel} />
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Status Breakdown
                </CardTitle>
                <CardDescription>Distribution of application statuses</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="pie">Pie</TabsTrigger>
              </TabsList>
              <TabsContent value="bar">
                {analytics.statusBreakdown.length > 0 ? (
                  <StatusBarChart data={analytics.statusBreakdown} />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No data yet. Add jobs to see status breakdown.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="pie">
                {analytics.statusBreakdown.length > 0 ? (
                  <StatusPieChart data={analytics.statusBreakdown} />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No data yet. Add jobs to see status breakdown.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Average Time in Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Average Time in Stage
            </CardTitle>
            <CardDescription>How long applications spend in each phase</CardDescription>
          </CardHeader>
          <CardContent>
            <StageTimeChart stages={analytics.avgStageTime} />
          </CardContent>
        </Card>
      </div>

      {/* Trends Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Application Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Weekly Application Trends
                </CardTitle>
                <CardDescription>Applications submitted per week</CardDescription>
              </div>
              <Tabs defaultValue="weekly" className="w-auto">
                <TabsList>
                  <TabsTrigger value="weekly">8 Weeks</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {analytics.weeklyTrends.some((w) => w.applied > 0) ? (
              <WeeklyTrendChart
                data={analytics.weeklyTrends}
                maxValue={analytics.maxApplied}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No application data yet. Apply dates will populate this chart.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Response Rate Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Response Rate Over Time
            </CardTitle>
            <CardDescription>Weekly response rate percentage</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.weeklyTrends.some((w) => w.applied > 0) ? (
              <ResponseRateTrendChart data={analytics.weeklyTrends} />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No response data yet. Track applications to see trends.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Top Companies Applied To
          </CardTitle>
          <CardDescription>
            Companies with the most applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopCompaniesChart companies={analytics.topCompanies} />
        </CardContent>
      </Card>

      {/* Empty State */}
      {jobs.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Start Tracking Your Progress
            </CardTitle>
            <CardDescription>
              Add job applications to see detailed analytics and insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              <li>Track your application funnel from saved to offer</li>
              <li>Monitor response rates and identify trends</li>
              <li>See which companies you&apos;ve applied to most</li>
              <li>Understand how long each stage takes on average</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
