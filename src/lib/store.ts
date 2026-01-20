import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Job,
  UserProfile,
  JobStats,
  WeeklyGoals,
  MonthlyGoals,
  GoalHistory,
  Resume,
  CoverLetterTemplate,
  PortfolioLink,
  Certificate,
} from '@/types';
import {
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  daysBetween,
} from './date-utils';

interface JobStore {
  // Jobs
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;

  // User Profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;

  // UI State
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;

  // Goals
  weeklyGoals: WeeklyGoals;
  monthlyGoals: MonthlyGoals;
  goalHistory: GoalHistory[];
  currentStreak: number;
  longestStreak: number;
  firstActiveDate: string | null;
  lastActiveDate: string | null;

  // Goals Actions
  setWeeklyGoals: (goals: WeeklyGoals) => void;
  setMonthlyGoals: (goals: MonthlyGoals) => void;
  addGoalHistory: (history: GoalHistory) => void;
  updateStreak: () => void;
  recordActivity: () => void;

  // Documents
  resumes: Resume[];
  coverLetterTemplates: CoverLetterTemplate[];
  portfolioLinks: PortfolioLink[];
  certificates: Certificate[];

  // Documents Actions
  addResume: (resume: Resume) => void;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  setPrimaryResume: (id: string) => void;

  addCoverLetterTemplate: (template: CoverLetterTemplate) => void;
  updateCoverLetterTemplate: (id: string, updates: Partial<CoverLetterTemplate>) => void;
  deleteCoverLetterTemplate: (id: string) => void;
  setDefaultCoverLetter: (id: string) => void;

  addPortfolioLink: (link: PortfolioLink) => void;
  updatePortfolioLink: (id: string, updates: Partial<PortfolioLink>) => void;
  deletePortfolioLink: (id: string) => void;

  addCertificate: (certificate: Certificate) => void;
  updateCertificate: (id: string, updates: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;

  // Computed
  getStats: () => JobStats;
  getWeeklyProgress: () => {
    applications: number;
    interviews: number;
    weekStart: Date;
    weekEnd: Date;
  };
  getMonthlyProgress: () => { applications: number; interviews: number; offers: number };
  getDaysActive: () => number;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      // Jobs State
      jobs: [],
      setJobs: (jobs) => set({ jobs }),
      addJob: (job) => {
        set((state) => ({ jobs: [...state.jobs, job] }));
        get().recordActivity();
      },
      updateJob: (id, updates) => {
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id ? { ...job, ...updates, updated_at: new Date().toISOString() } : job
          ),
        }));
        get().recordActivity();
      },
      deleteJob: (id) =>
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        })),

      // Profile State
      profile: null,
      setProfile: (profile) => set({ profile }),

      // UI State
      selectedJobId: null,
      setSelectedJobId: (id) => set({ selectedJobId: id }),

      // Goals State
      weeklyGoals: {
        applicationsTarget: 10,
        interviewsTarget: 2,
      },
      monthlyGoals: {
        applicationsTarget: 40,
        interviewsTarget: 8,
        offersTarget: 1,
        networkingEventsTarget: 4,
      },
      goalHistory: [],
      currentStreak: 0,
      longestStreak: 0,
      firstActiveDate: null,
      lastActiveDate: null,

      // Goals Actions
      setWeeklyGoals: (goals) => set({ weeklyGoals: goals }),
      setMonthlyGoals: (goals) => set({ monthlyGoals: goals }),
      addGoalHistory: (history) =>
        set((state) => ({
          goalHistory: [...state.goalHistory, history],
        })),
      updateStreak: () => {
        const state = get();
        const history = state.goalHistory;
        if (history.length === 0) return;

        // Sort by week start date descending
        const sortedHistory = [...history].sort(
          (a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
        );

        let streak = 0;
        for (const week of sortedHistory) {
          if (week.completed) {
            streak++;
          } else {
            break;
          }
        }

        const newLongestStreak = Math.max(state.longestStreak, streak);
        set({ currentStreak: streak, longestStreak: newLongestStreak });
      },
      recordActivity: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const lastActive = state.lastActiveDate;

        if (!state.firstActiveDate) {
          set({ firstActiveDate: today, lastActiveDate: today, currentStreak: 1 });
        } else if (lastActive !== today) {
          // Check if we broke the streak (more than 1 day gap)
          if (lastActive) {
            const lastDate = new Date(lastActive);
            const todayDate = new Date(today);
            const daysDiff = daysBetween(lastDate, todayDate);

            if (daysDiff > 1) {
              // Streak broken
              set({ currentStreak: 1, lastActiveDate: today });
            } else {
              // Continue streak
              set((s) => ({
                currentStreak: s.currentStreak + 1,
                lastActiveDate: today,
                longestStreak: Math.max(s.longestStreak, s.currentStreak + 1),
              }));
            }
          } else {
            set({ lastActiveDate: today });
          }
        }
      },

      // Documents State
      resumes: [],
      coverLetterTemplates: [],
      portfolioLinks: [],
      certificates: [],

      // Resume Actions
      addResume: (resume) => set((state) => ({ resumes: [...state.resumes, resume] })),
      updateResume: (id, updates) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
          ),
        })),
      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
        })),
      setPrimaryResume: (id) =>
        set((state) => ({
          resumes: state.resumes.map((r) => ({
            ...r,
            is_primary: r.id === id,
          })),
        })),

      // Cover Letter Template Actions
      addCoverLetterTemplate: (template) =>
        set((state) => ({ coverLetterTemplates: [...state.coverLetterTemplates, template] })),
      updateCoverLetterTemplate: (id, updates) =>
        set((state) => ({
          coverLetterTemplates: state.coverLetterTemplates.map((t) =>
            t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
          ),
        })),
      deleteCoverLetterTemplate: (id) =>
        set((state) => ({
          coverLetterTemplates: state.coverLetterTemplates.filter((t) => t.id !== id),
        })),
      setDefaultCoverLetter: (id) =>
        set((state) => ({
          coverLetterTemplates: state.coverLetterTemplates.map((t) => ({
            ...t,
            is_default: t.id === id,
          })),
        })),

      // Portfolio Link Actions
      addPortfolioLink: (link) =>
        set((state) => ({ portfolioLinks: [...state.portfolioLinks, link] })),
      updatePortfolioLink: (id, updates) =>
        set((state) => ({
          portfolioLinks: state.portfolioLinks.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),
      deletePortfolioLink: (id) =>
        set((state) => ({
          portfolioLinks: state.portfolioLinks.filter((l) => l.id !== id),
        })),

      // Certificate Actions
      addCertificate: (certificate) =>
        set((state) => ({ certificates: [...state.certificates, certificate] })),
      updateCertificate: (id, updates) =>
        set((state) => ({
          certificates: state.certificates.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCertificate: (id) =>
        set((state) => ({
          certificates: state.certificates.filter((c) => c.id !== id),
        })),

      // Computed Stats
      getStats: () => {
        const jobs = get().jobs;
        const total = jobs.length;
        const saved = jobs.filter((j) => j.status === 'saved').length;
        const applied = jobs.filter((j) => j.status === 'applied').length;
        const interviewing = jobs.filter((j) =>
          ['screening', 'interview', 'technical', 'final'].includes(j.status)
        ).length;
        const offers = jobs.filter((j) => ['offer', 'accepted'].includes(j.status)).length;
        const rejected = jobs.filter((j) => j.status === 'rejected').length;

        const appliedOrBeyond = jobs.filter((j) => j.status !== 'saved').length;
        const gotResponse = jobs.filter((j) =>
          ['screening', 'interview', 'technical', 'final', 'offer', 'accepted', 'rejected'].includes(
            j.status
          )
        ).length;

        return {
          total,
          saved,
          applied,
          interviewing,
          offers,
          rejected,
          response_rate: appliedOrBeyond > 0 ? Math.round((gotResponse / appliedOrBeyond) * 100) : 0,
        };
      },

      getWeeklyProgress: () => {
        const jobs = get().jobs;
        const now = new Date();
        const weekStart = getStartOfWeek(now);
        const weekEnd = getEndOfWeek(now);

        // Count applications this week
        const applications = jobs.filter((job) => {
          if (!job.applied_date) return false;
          const appliedDate = new Date(job.applied_date);
          return appliedDate >= weekStart && appliedDate <= weekEnd;
        }).length;

        // Count interviews this week (jobs that moved to interview status this week)
        const interviews = jobs.filter((job) => {
          if (!['screening', 'interview', 'technical', 'final'].includes(job.status)) return false;
          const updatedDate = new Date(job.updated_at);
          return updatedDate >= weekStart && updatedDate <= weekEnd;
        }).length;

        return { applications, interviews, weekStart, weekEnd };
      },

      getMonthlyProgress: () => {
        const jobs = get().jobs;
        const now = new Date();
        const monthStart = getStartOfMonth(now);
        const monthEnd = getEndOfMonth(now);

        const applications = jobs.filter((job) => {
          if (!job.applied_date) return false;
          const appliedDate = new Date(job.applied_date);
          return appliedDate >= monthStart && appliedDate <= monthEnd;
        }).length;

        const interviews = jobs.filter((job) => {
          if (!['screening', 'interview', 'technical', 'final'].includes(job.status)) return false;
          const updatedDate = new Date(job.updated_at);
          return updatedDate >= monthStart && updatedDate <= monthEnd;
        }).length;

        const offers = jobs.filter((job) => {
          if (!['offer', 'accepted'].includes(job.status)) return false;
          const updatedDate = new Date(job.updated_at);
          return updatedDate >= monthStart && updatedDate <= monthEnd;
        }).length;

        return { applications, interviews, offers };
      },

      getDaysActive: () => {
        const state = get();
        if (!state.firstActiveDate) return 0;
        const firstDate = new Date(state.firstActiveDate);
        const today = new Date();
        return daysBetween(firstDate, today) + 1;
      },
    }),
    {
      name: 'job-hunt-storage',
      partialize: (state) => ({
        jobs: state.jobs,
        profile: state.profile,
        weeklyGoals: state.weeklyGoals,
        monthlyGoals: state.monthlyGoals,
        goalHistory: state.goalHistory,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        firstActiveDate: state.firstActiveDate,
        lastActiveDate: state.lastActiveDate,
        resumes: state.resumes,
        coverLetterTemplates: state.coverLetterTemplates,
        portfolioLinks: state.portfolioLinks,
        certificates: state.certificates,
      }),
    }
  )
);
