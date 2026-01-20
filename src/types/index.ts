// Job Application Types for Job Hunt Tracker

export type JobStatus =
  | 'saved'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'technical'
  | 'final'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type JobType = 'remote' | 'hybrid' | 'onsite';

export type Priority = 'high' | 'medium' | 'low';

export interface Job {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;

  // Company Info
  company: string;
  company_url?: string;
  company_logo?: string;

  // Job Details
  title: string;
  description?: string;
  job_url?: string;
  job_type: JobType;
  location?: string;

  // Compensation
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;

  // Application Status
  status: JobStatus;
  priority: Priority;
  applied_date?: string;

  // Contacts
  recruiter_name?: string;
  recruiter_email?: string;
  recruiter_phone?: string;
  hiring_manager?: string;

  // Notes & Context
  notes?: string;
  interview_notes?: string;

  // Tracking
  next_action?: string;
  next_action_date?: string;

  // Source
  source?: string; // linkedin, indeed, referral, etc.
  referral_name?: string;
}

export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;

  // Basic Info
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;

  // Job Search Preferences
  target_roles: string[];
  target_salary_min?: number;
  target_salary_max?: number;
  preferred_job_type: JobType[];
  willing_to_relocate: boolean;

  // Resume & Documents
  resume_url?: string;
  resume_text?: string; // For Claude context

  // Skills & Experience
  skills: string[];
  years_of_experience?: number;
  current_title?: string;
  current_company?: string;

  // Additional Context for AI
  career_goals?: string;
  elevator_pitch?: string;
}

export interface Note {
  id: string;
  created_at: string;
  job_id?: string;
  user_id: string;
  content: string;
  type: 'general' | 'interview' | 'research' | 'follow-up';
}

export interface JobStats {
  total: number;
  saved: number;
  applied: number;
  interviewing: number;
  offers: number;
  rejected: number;
  response_rate: number;
}

// Goals Types
export interface WeeklyGoals {
  applicationsTarget: number;
  interviewsTarget: number;
}

export interface MonthlyGoals {
  applicationsTarget: number;
  interviewsTarget: number;
  offersTarget: number;
  networkingEventsTarget: number;
}

export interface GoalHistory {
  id: string;
  weekStart: string; // ISO date string (Monday of the week)
  weekEnd: string; // ISO date string (Sunday of the week)
  applicationsTarget: number;
  applicationsAchieved: number;
  interviewsTarget: number;
  interviewsAchieved: number;
  completed: boolean;
}

export interface GoalsState {
  weeklyGoals: WeeklyGoals;
  monthlyGoals: MonthlyGoals;
  goalHistory: GoalHistory[];
  currentStreak: number;
  longestStreak: number;
  firstActiveDate: string | null; // ISO date string
  lastActiveDate: string | null; // ISO date string
}

// Document Types for Documents Page

export interface Resume {
  id: string;
  created_at: string;
  updated_at: string;
  filename: string;
  url?: string;
  text?: string;
  is_primary: boolean;
}

export interface CoverLetterTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  content: string;
  target_role?: string;
  is_default: boolean;
}

export type PortfolioLinkType = 'project' | 'website' | 'github' | 'demo' | 'other';

export interface PortfolioLink {
  id: string;
  created_at: string;
  title: string;
  url: string;
  description?: string;
  type: PortfolioLinkType;
}

export interface Certificate {
  id: string;
  created_at: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
}

export interface DocumentsState {
  resumes: Resume[];
  coverLetterTemplates: CoverLetterTemplate[];
  portfolioLinks: PortfolioLink[];
  certificates: Certificate[];
}
