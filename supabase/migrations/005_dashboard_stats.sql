-- ── DASHBOARD STATS & TRACKING ──

-- 1. Learning sessions table for study time tracking
CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id), -- Changed to UUID for foreign key consistency
  session_date DATE DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_date)
);

-- 2. Ensure profiles has all columns for achievement system
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level_xp INTEGER DEFAULT 0;

-- Note: xp, level, streak_days already exist in profiles from 001.

-- 3. Update enrollments with progress tracking info if missing
ALTER TABLE public.enrollments 
  ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_lesson_title TEXT,
  ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ DEFAULT NOW();

-- 4. RLS policies
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.learning_sessions;
CREATE POLICY "Users can manage own sessions" ON public.learning_sessions
  FOR ALL USING (auth.uid() = user_id);

-- 5. Helper function for study progress circle
-- (Calculated on frontend, but we ensure the data points exist)
