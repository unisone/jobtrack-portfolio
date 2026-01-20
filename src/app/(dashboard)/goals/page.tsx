'use client';

// Force dynamic rendering to bypass SSG prerender issues with Zustand store
// See: https://github.com/vercel/next.js/issues/85668
export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useJobStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Target,
  Trophy,
  Flame,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Edit2,
  Save,
  X,
  Briefcase,
  MessageSquare,
  Award,
  Users,
  Zap,
  Star,
} from 'lucide-react';

function ProgressCard({
  title,
  current,
  target,
  icon: Icon,
  color,
  description,
}: {
  title: string;
  current: number;
  target: number;
  icon: React.ElementType;
  color: string;
  description?: string;
}) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isComplete = current >= target;

  return (
    <Card className={isComplete ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${isComplete ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <Icon className={`h-4 w-4 ${color}`} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold">{current}</span>
            <span className="text-sm text-muted-foreground">/ {target}</span>
          </div>
          <Progress
            value={percentage}
            className={`h-2 ${isComplete ? '[&>div]:bg-green-500' : ''}`}
          />
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {isComplete && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Goal achieved!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MotivationalStat({
  value,
  label,
  icon: Icon,
  color,
  sublabel,
}: {
  value: number | string;
  label: string;
  icon: React.ElementType;
  color: string;
  sublabel?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}

function GoalHistoryItem({
  weekStart,
  weekEnd,
  applicationsTarget,
  applicationsAchieved,
  interviewsTarget,
  interviewsAchieved,
  completed,
}: {
  weekStart: string;
  weekEnd: string;
  applicationsTarget: number;
  applicationsAchieved: number;
  interviewsTarget: number;
  interviewsAchieved: number;
  completed: boolean;
}) {
  const startDate = new Date(weekStart);
  const endDate = new Date(weekEnd);
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3 ${
        completed ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium">
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>
              Apps: {applicationsAchieved}/{applicationsTarget}
            </span>
            <span>
              Interviews: {interviewsAchieved}/{interviewsTarget}
            </span>
          </div>
        </div>
      </div>
      {completed && (
        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          Completed
        </Badge>
      )}
    </div>
  );
}

export default function GoalsPage() {
  const {
    weeklyGoals,
    monthlyGoals,
    setWeeklyGoals,
    setMonthlyGoals,
    goalHistory,
    currentStreak,
    longestStreak,
    getDaysActive,
    getWeeklyProgress,
    getMonthlyProgress,
  } = useJobStore();

  const [isEditingWeekly, setIsEditingWeekly] = useState(false);
  const [isEditingMonthly, setIsEditingMonthly] = useState(false);

  const [tempWeeklyGoals, setTempWeeklyGoals] = useState(weeklyGoals);
  const [tempMonthlyGoals, setTempMonthlyGoals] = useState(monthlyGoals);

  const weeklyProgress = getWeeklyProgress();
  const monthlyProgress = getMonthlyProgress();
  const daysActive = getDaysActive();

  // Calculate week date range for display
  const weekDateRange = useMemo(() => {
    const formatDate = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${formatDate(weeklyProgress.weekStart)} - ${formatDate(weeklyProgress.weekEnd)}`;
  }, [weeklyProgress.weekStart, weeklyProgress.weekEnd]);

  // Calculate month name for display
  const monthName = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, []);

  // Calculate overall weekly completion percentage
  const weeklyCompletion = useMemo(() => {
    const appProgress =
      weeklyGoals.applicationsTarget > 0
        ? (weeklyProgress.applications / weeklyGoals.applicationsTarget) * 100
        : 0;
    const intProgress =
      weeklyGoals.interviewsTarget > 0
        ? (weeklyProgress.interviews / weeklyGoals.interviewsTarget) * 100
        : 0;
    return Math.min((appProgress + intProgress) / 2, 100);
  }, [weeklyProgress, weeklyGoals]);

  // Calculate overall monthly completion percentage
  const monthlyCompletion = useMemo(() => {
    const appProgress =
      monthlyGoals.applicationsTarget > 0
        ? (monthlyProgress.applications / monthlyGoals.applicationsTarget) * 100
        : 0;
    const intProgress =
      monthlyGoals.interviewsTarget > 0
        ? (monthlyProgress.interviews / monthlyGoals.interviewsTarget) * 100
        : 0;
    const offersProgress =
      monthlyGoals.offersTarget > 0
        ? (monthlyProgress.offers / monthlyGoals.offersTarget) * 100
        : 0;
    return Math.min((appProgress + intProgress + offersProgress) / 3, 100);
  }, [monthlyProgress, monthlyGoals]);

  const handleSaveWeeklyGoals = () => {
    setWeeklyGoals(tempWeeklyGoals);
    setIsEditingWeekly(false);
  };

  const handleSaveMonthlyGoals = () => {
    setMonthlyGoals(tempMonthlyGoals);
    setIsEditingMonthly(false);
  };

  const handleCancelWeeklyEdit = () => {
    setTempWeeklyGoals(weeklyGoals);
    setIsEditingWeekly(false);
  };

  const handleCancelMonthlyEdit = () => {
    setTempMonthlyGoals(monthlyGoals);
    setIsEditingMonthly(false);
  };

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (weeklyCompletion >= 100) {
      return "You're crushing it! Keep up the amazing work!";
    } else if (weeklyCompletion >= 75) {
      return "Almost there! Just a little more effort to hit your goals.";
    } else if (weeklyCompletion >= 50) {
      return "Halfway through! Stay focused and keep pushing.";
    } else if (weeklyCompletion >= 25) {
      return "Good start! Remember: consistency is key to success.";
    }
    return "Every application counts. Start building momentum today!";
  };

  // Sort goal history by date descending
  const sortedHistory = useMemo(() => {
    return [...goalHistory].sort(
      (a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
    );
  }, [goalHistory]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">
            Set targets, track progress, and stay motivated in your job search.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 p-4">
          <Zap className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{getMotivationalMessage()}</span>
        </div>
      </div>

      {/* Motivational Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MotivationalStat
          value={daysActive}
          label="Days Active"
          icon={Calendar}
          color="bg-blue-500"
          sublabel="Keep showing up!"
        />
        <MotivationalStat
          value={currentStreak}
          label="Current Streak"
          icon={Flame}
          color="bg-orange-500"
          sublabel={currentStreak > 0 ? "You're on fire!" : 'Start your streak today'}
        />
        <MotivationalStat
          value={longestStreak}
          label="Longest Streak"
          icon={Trophy}
          color="bg-yellow-500"
          sublabel="Personal best"
        />
        <MotivationalStat
          value={`${Math.round(weeklyCompletion)}%`}
          label="Weekly Progress"
          icon={Target}
          color="bg-green-500"
          sublabel={weekDateRange}
        />
      </div>

      {/* Weekly Goals Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Weekly Goals</CardTitle>
                <CardDescription>{weekDateRange}</CardDescription>
              </div>
            </div>
            {!isEditingWeekly ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditingWeekly(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Goals
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelWeeklyEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveWeeklyGoals}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingWeekly ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weekly-applications">Applications Target</Label>
                <Input
                  id="weekly-applications"
                  type="number"
                  min="1"
                  value={tempWeeklyGoals.applicationsTarget}
                  onChange={(e) =>
                    setTempWeeklyGoals({
                      ...tempWeeklyGoals,
                      applicationsTarget: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekly-interviews">Interviews Target</Label>
                <Input
                  id="weekly-interviews"
                  type="number"
                  min="0"
                  value={tempWeeklyGoals.interviewsTarget}
                  onChange={(e) =>
                    setTempWeeklyGoals({
                      ...tempWeeklyGoals,
                      interviewsTarget: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <ProgressCard
                title="Applications"
                current={weeklyProgress.applications}
                target={weeklyGoals.applicationsTarget}
                icon={Briefcase}
                color="text-blue-500"
                description="Job applications submitted this week"
              />
              <ProgressCard
                title="Interviews"
                current={weeklyProgress.interviews}
                target={weeklyGoals.interviewsTarget}
                icon={MessageSquare}
                color="text-purple-500"
                description="Interview stages reached this week"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Goals Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Monthly Goals</CardTitle>
                <CardDescription>{monthName}</CardDescription>
              </div>
            </div>
            {!isEditingMonthly ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditingMonthly(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Goals
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelMonthlyEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveMonthlyGoals}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingMonthly ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-applications">Applications Target</Label>
                <Input
                  id="monthly-applications"
                  type="number"
                  min="1"
                  value={tempMonthlyGoals.applicationsTarget}
                  onChange={(e) =>
                    setTempMonthlyGoals({
                      ...tempMonthlyGoals,
                      applicationsTarget: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-interviews">Interviews Target</Label>
                <Input
                  id="monthly-interviews"
                  type="number"
                  min="0"
                  value={tempMonthlyGoals.interviewsTarget}
                  onChange={(e) =>
                    setTempMonthlyGoals({
                      ...tempMonthlyGoals,
                      interviewsTarget: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-offers">Offers Target</Label>
                <Input
                  id="monthly-offers"
                  type="number"
                  min="0"
                  value={tempMonthlyGoals.offersTarget}
                  onChange={(e) =>
                    setTempMonthlyGoals({
                      ...tempMonthlyGoals,
                      offersTarget: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-networking">Networking Events</Label>
                <Input
                  id="monthly-networking"
                  type="number"
                  min="0"
                  value={tempMonthlyGoals.networkingEventsTarget}
                  onChange={(e) =>
                    setTempMonthlyGoals({
                      ...tempMonthlyGoals,
                      networkingEventsTarget: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <>
              {/* Monthly Progress Overview */}
              <div className="mb-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-4 dark:from-purple-950/30 dark:to-blue-950/30">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Monthly Progress</span>
                  <span className="text-lg font-bold">{Math.round(monthlyCompletion)}%</span>
                </div>
                <Progress value={monthlyCompletion} className="h-3" />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <ProgressCard
                  title="Applications"
                  current={monthlyProgress.applications}
                  target={monthlyGoals.applicationsTarget}
                  icon={Briefcase}
                  color="text-blue-500"
                />
                <ProgressCard
                  title="Interviews"
                  current={monthlyProgress.interviews}
                  target={monthlyGoals.interviewsTarget}
                  icon={MessageSquare}
                  color="text-purple-500"
                />
                <ProgressCard
                  title="Offers"
                  current={monthlyProgress.offers}
                  target={monthlyGoals.offersTarget}
                  icon={Award}
                  color="text-green-500"
                />
                <ProgressCard
                  title="Networking"
                  current={0}
                  target={monthlyGoals.networkingEventsTarget}
                  icon={Users}
                  color="text-orange-500"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Goal History Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <CardTitle>Goal History</CardTitle>
              <CardDescription>Track your weekly achievements over time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Trophy className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">No history yet</p>
              <p className="text-sm text-muted-foreground">
                Complete your first week of goals to start building your history.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedHistory.slice(0, 10).map((history) => (
                <GoalHistoryItem
                  key={history.id}
                  weekStart={history.weekStart}
                  weekEnd={history.weekEnd}
                  applicationsTarget={history.applicationsTarget}
                  applicationsAchieved={history.applicationsAchieved}
                  interviewsTarget={history.interviewsTarget}
                  interviewsAchieved={history.interviewsAchieved}
                  completed={history.completed}
                />
              ))}
              {sortedHistory.length > 10 && (
                <p className="pt-2 text-center text-sm text-muted-foreground">
                  Showing last 10 weeks. Total: {sortedHistory.length} weeks tracked.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Pro Tips for Job Hunting Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Apply to 10-15 jobs per week for optimal results</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Follow up on applications after 1 week</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Customize your resume for each role</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Network actively - many jobs are filled through referrals</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Track every application to spot patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Take breaks to avoid burnout - consistency beats intensity</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
