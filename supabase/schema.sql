-- Job Hunt Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Info
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,

  -- Job Search Preferences
  target_roles TEXT[] DEFAULT '{}',
  target_salary_min INTEGER,
  target_salary_max INTEGER,
  preferred_job_type TEXT[] DEFAULT '{remote}',
  willing_to_relocate BOOLEAN DEFAULT false,

  -- Resume & Skills
  resume_url TEXT,
  resume_text TEXT,
  skills TEXT[] DEFAULT '{}',
  years_of_experience INTEGER,
  current_title TEXT,
  current_company TEXT,

  -- AI Context
  career_goals TEXT,
  elevator_pitch TEXT,

  UNIQUE(user_id)
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Company Info
  company TEXT NOT NULL,
  company_url TEXT,
  company_logo TEXT,

  -- Job Details
  title TEXT NOT NULL,
  description TEXT,
  job_url TEXT,
  job_type TEXT DEFAULT 'remote' CHECK (job_type IN ('remote', 'hybrid', 'onsite')),
  location TEXT,

  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',

  -- Application Status
  status TEXT DEFAULT 'saved' CHECK (status IN (
    'saved', 'applied', 'screening', 'interview',
    'technical', 'final', 'offer', 'accepted',
    'rejected', 'withdrawn'
  )),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  applied_date TIMESTAMPTZ,

  -- Contacts
  recruiter_name TEXT,
  recruiter_email TEXT,
  recruiter_phone TEXT,
  hiring_manager TEXT,

  -- Notes
  notes TEXT,
  interview_notes TEXT,

  -- Tracking
  next_action TEXT,
  next_action_date TIMESTAMPTZ,

  -- Source
  source TEXT,
  referral_name TEXT
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  content TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'interview', 'research', 'follow-up'))
);

-- Activities table (for tracking job search activity)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_job_id ON notes(job_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- IMPORTANT: Using (SELECT auth.uid()) instead of auth.uid() for performance
-- This caches the user ID per statement instead of evaluating per row
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own jobs"
  ON jobs FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own jobs"
  ON jobs FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own jobs"
  ON jobs FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can manage own notes"
  ON notes FOR ALL
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
