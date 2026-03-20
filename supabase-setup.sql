-- ============================================
-- Prospect Profiler - Supabase Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================

-- 1. Helper: auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'advisor' CHECK (role IN ('advisor', 'manager')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username'),
    'advisor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Results table
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  advisor_name TEXT NOT NULL,
  prospect_name TEXT NOT NULL,
  age_range TEXT,
  occupation TEXT,
  meeting TEXT,
  disc_primary TEXT NOT NULL CHECK (disc_primary IN ('D','I','S','C')),
  disc_secondary TEXT NOT NULL CHECK (disc_secondary IN ('D','I','S','C')),
  score_d INTEGER NOT NULL DEFAULT 0,
  score_i INTEGER NOT NULL DEFAULT 0,
  score_s INTEGER NOT NULL DEFAULT 0,
  score_c INTEGER NOT NULL DEFAULT 0,
  mbti TEXT NOT NULL,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  observations_count INTEGER NOT NULL DEFAULT 0,
  raw_answers JSONB,
  nv_observations JSONB,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_results_user_id ON public.results(user_id);
CREATE INDEX idx_results_created_at ON public.results(created_at DESC);

CREATE TRIGGER results_updated_at
  BEFORE UPDATE ON public.results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- 6. Profiles RLS policies
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Managers read all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
  );

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 7. Results RLS policies
CREATE POLICY "Users insert own results"
  ON public.results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own results"
  ON public.results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own results"
  ON public.results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own results"
  ON public.results FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Managers read all results"
  ON public.results FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
  );

-- ============================================
-- To promote a user to manager, run:
-- UPDATE public.profiles SET role = 'manager' WHERE email = 'user@example.com';
-- ============================================
