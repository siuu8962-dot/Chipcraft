-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- USERS (extends Supabase auth.users)
-- ─────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  role text default 'student' check (role in ('student', 'instructor', 'admin')),
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  xp integer default 0,
  level integer default 1,
  streak_days integer default 0,
  last_active_date date,
  total_study_minutes integer default 0,
  preferred_language text default 'vi' check (preferred_language in ('vi', 'en')),
  theme text default 'dark' check (theme in ('dark', 'light', 'system')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- COURSES
-- ─────────────────────────────────────────
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title_vi text not null,
  title_en text not null,
  description_vi text,
  description_en text,
  thumbnail_url text,
  instructor_id uuid references public.profiles(id),
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced', 'expert')),
  duration_hours integer default 0,
  lesson_count integer default 0,
  student_count integer default 0,
  rating numeric(3,2) default 0,
  rating_count integer default 0,
  price_usd numeric(10,2) default 0,
  is_published boolean default false,
  is_free boolean default false,
  prerequisites text[] default '{}',
  tags text[] default '{}',
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- SECTIONS (weeks/modules inside a course)
-- ─────────────────────────────────────────
create table public.course_sections (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title_vi text not null,
  title_en text not null,
  order_index integer not null,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- LESSONS
-- ─────────────────────────────────────────
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  section_id uuid references public.course_sections(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  slug text not null,
  title_vi text not null,
  title_en text not null,
  description_vi text,
  description_en text,
  content_vi text,
  content_en text,
  video_url text,
  duration_minutes integer default 0,
  type text default 'video' check (type in ('video', 'article', 'lab', 'quiz')),
  order_index integer not null,
  is_free_preview boolean default false,
  xp_reward integer default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- LAB EXERCISES
-- ─────────────────────────────────────────
create table public.lab_exercises (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title_vi text not null,
  title_en text not null,
  description_vi text,
  description_en text,
  starter_code text,
  solution_code text,
  testbench_code text,
  language text default 'verilog' check (language in ('verilog', 'vhdl', 'systemverilog')),
  expected_output text,
  hints text[] default '{}',
  xp_reward integer default 25,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- QUIZ QUESTIONS
-- ─────────────────────────────────────────
create table public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  question_vi text not null,
  question_en text not null,
  options_vi jsonb not null,
  options_en jsonb not null,
  correct_option integer not null,
  explanation_vi text,
  explanation_en text,
  order_index integer default 0,
  xp_reward integer default 5
);

-- ─────────────────────────────────────────
-- ENROLLMENTS
-- ─────────────────────────────────────────
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  progress_percent integer default 0,
  unique(user_id, course_id)
);

-- ─────────────────────────────────────────
-- LESSON PROGRESS
-- ─────────────────────────────────────────
create table public.lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  completed boolean default false,
  completed_at timestamptz,
  time_spent_seconds integer default 0,
  video_progress_seconds integer default 0,
  quiz_score integer,
  lab_passed boolean default false,
  unique(user_id, lesson_id)
);

-- ─────────────────────────────────────────
-- LAB SUBMISSIONS
-- ─────────────────────────────────────────
create table public.lab_submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  lab_id uuid references public.lab_exercises(id) on delete cascade,
  code text not null,
  output text,
  passed boolean default false,
  submitted_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- AI TUTOR CONVERSATIONS
-- ─────────────────────────────────────────
create table public.ai_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id),
  course_id uuid references public.courses(id),
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.ai_messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.ai_conversations(id) on delete cascade,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  tokens_used integer default 0,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- ACHIEVEMENTS & BADGES
-- ─────────────────────────────────────────
create table public.badges (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name_vi text not null,
  name_en text not null,
  description_vi text,
  description_en text,
  icon text not null,
  color text default '#00D4B4',
  xp_reward integer default 50,
  condition_type text,
  condition_value integer
);

create table public.user_badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- ─────────────────────────────────────────
-- CERTIFICATES
-- ─────────────────────────────────────────
create table public.certificates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  certificate_url text,
  issued_at timestamptz default now(),
  unique(user_id, course_id)
);

-- ─────────────────────────────────────────
-- ACTIVITY LOG
-- ─────────────────────────────────────────
create table public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null,
  description_vi text,
  description_en text,
  metadata jsonb default '{}',
  xp_earned integer default 0,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title_vi text not null,
  title_en text not null,
  body_vi text,
  body_en text,
  type text default 'info' check (type in ('info', 'success', 'warning', 'achievement')),
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- AI USAGE LIMITS
-- ─────────────────────────────────────────
create table public.ai_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  month_year text not null,
  messages_used integer default 0,
  tokens_used integer default 0,
  unique(user_id, month_year)
);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.user_badges enable row level security;
alter table public.certificates enable row level security;
alter table public.activity_log enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_usage enable row level security;
alter table public.lab_submissions enable row level security;

-- Profiles: users can read/update own profile
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- Public read on courses and lessons
create policy "courses_public_read" on public.courses for select using (is_published = true);
create policy "lessons_public_read" on public.lessons for select using (true);
create policy "sections_public_read" on public.course_sections for select using (true);
create policy "badges_public_read" on public.badges for select using (true);
create policy "quiz_public_read" on public.quiz_questions for select using (true);
create policy "lab_public_read" on public.lab_exercises for select using (true);

-- Enrollments: own only
create policy "enrollments_own" on public.enrollments using (auth.uid() = user_id);
create policy "progress_own" on public.lesson_progress using (auth.uid() = user_id);
create policy "ai_conv_own" on public.ai_conversations using (auth.uid() = user_id);
create policy "ai_msg_own" on public.ai_messages using (
  conversation_id in (select id from public.ai_conversations where user_id = auth.uid())
);
create policy "badges_own" on public.user_badges for select using (auth.uid() = user_id);
create policy "certs_own" on public.certificates for select using (auth.uid() = user_id);
create policy "activity_own" on public.activity_log for select using (auth.uid() = user_id);
create policy "notif_own" on public.notifications using (auth.uid() = user_id);
create policy "ai_usage_own" on public.ai_usage using (auth.uid() = user_id);
create policy "lab_sub_own" on public.lab_submissions using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- FUNCTIONS & TRIGGERS
-- ─────────────────────────────────────────

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update streak on daily activity
create or replace function public.update_streak(p_user_id uuid)
returns void as $$
declare
  v_last_date date;
  v_today date := current_date;
begin
  select last_active_date into v_last_date from public.profiles where id = p_user_id;
  if v_last_date = v_today - interval '1 day' then
    update public.profiles set streak_days = streak_days + 1, last_active_date = v_today where id = p_user_id;
  elsif v_last_date < v_today - interval '1 day' or v_last_date is null then
    update public.profiles set streak_days = 1, last_active_date = v_today where id = p_user_id;
  end if;
end;
$$ language plpgsql security definer;

-- Add XP to user
create or replace function public.add_xp(p_user_id uuid, p_xp integer)
returns void as $$
declare
  v_new_xp integer;
  v_new_level integer;
begin
  update public.profiles set xp = xp + p_xp where id = p_user_id returning xp into v_new_xp;
  v_new_level := greatest(1, floor(v_new_xp / 500) + 1);
  update public.profiles set level = v_new_level where id = p_user_id;
end;
$$ language plpgsql security definer;

-- ─────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────
-- Insert courses
insert into public.courses (slug, title_vi, title_en, description_vi, description_en, difficulty, duration_hours, lesson_count, student_count, rating, rating_count, is_published, is_free, order_index) values
('digital-logic-fundamentals', 'Nền tảng số & Logic', 'Digital Logic Fundamentals', 'Khóa học từ cổng logic cơ bản đến mạch tuần tự. Nền tảng bắt buộc cho mọi chip designer.', 'From basic logic gates to sequential circuits. Essential foundation for every chip designer.', 'beginner', 8, 24, 1243, 4.9, 312, true, true, 1),
('rtl-design-verilog', 'RTL Design với Verilog', 'RTL Design with Verilog', 'Thiết kế RTL chuyên nghiệp với Verilog. Từ flip-flop đến processor pipeline.', 'Professional RTL design with Verilog. From flip-flops to processor pipelines.', 'intermediate', 12, 20, 876, 4.8, 198, true, false, 2),
('asic-design-flow', 'ASIC Design Flow', 'ASIC Design Flow', 'Toàn bộ quy trình từ RTL đến GDS2. Synthesis, P&R với OpenROAD.', 'Complete RTL-to-GDS2 flow. Synthesis and P&R with OpenROAD.', 'advanced', 20, 32, 432, 4.7, 89, true, false, 3),
('verification-testbench', 'Verification & Testbench', 'Verification & Testbench', 'SystemVerilog, UVM, functional coverage. Kỹ năng verification chuẩn công nghiệp.', 'SystemVerilog, UVM, functional coverage. Industry-standard verification skills.', 'intermediate', 10, 18, 321, 4.8, 67, true, false, 4),
('ai-chip-architecture', 'Kiến trúc AI Chip', 'AI Chip Architecture', 'NPU, systolic array, memory hierarchy. Thiết kế accelerator cho AI workload.', 'NPU, systolic arrays, memory hierarchy. Design accelerators for AI workloads.', 'expert', 18, 28, 198, 4.9, 45, true, false, 5),
('fpga-prototyping', 'FPGA Prototyping', 'FPGA Prototyping', 'Prototyping trên FPGA Xilinx/Intel. Từ synthesis đến bitstream.', 'Prototyping on Xilinx/Intel FPGAs. From synthesis to bitstream.', 'intermediate', 14, 22, 567, 4.7, 123, true, false, 6);

-- Insert badges
insert into public.badges (slug, name_vi, name_en, description_vi, description_en, icon, color, xp_reward, condition_type, condition_value) values
('first-compile', 'Biên dịch đầu tiên', 'First Compile', 'Chạy code Verilog thành công lần đầu', 'Successfully ran Verilog code for the first time', 'CircuitBoard', '#00D4B4', 50, 'lab_submissions', 1),
('course-complete', 'Hoàn thành khóa học', 'Course Complete', 'Hoàn thành khóa học đầu tiên', 'Completed your first course', 'Trophy', '#F59E0B', 200, 'courses_completed', 1),
('lab-rat', 'Lab Enthusiast', 'Lab Enthusiast', 'Hoàn thành 10 bài lab', 'Completed 10 lab exercises', 'Flask', '#3B82F6', 100, 'labs_completed', 10),
('ai-apprentice', 'AI Apprentice', 'AI Apprentice', 'Gửi 50 tin nhắn cho AI Tutor', 'Sent 50 messages to AI Tutor', 'Sparkle', '#8B5CF6', 75, 'ai_messages', 50),
('speed-coder', 'Speed Coder', 'Speed Coder', 'Hoàn thành quiz dưới 2 phút', 'Completed a quiz in under 2 minutes', 'Lightning', '#F59E0B', 60, 'quiz_speed', 120),
('seven-day-streak', '7 Ngày liên tiếp', '7-Day Streak', 'Học 7 ngày liên tiếp', 'Studied 7 days in a row', 'Fire', '#FF6B6B', 150, 'streak_days', 7),
('thirty-day-streak', '30 Ngày liên tiếp', '30-Day Streak', 'Học 30 ngày liên tiếp', 'Studied 30 days in a row', 'Fire', '#FF4444', 500, 'streak_days', 30),
('top-student', 'Top 10 Học Viên', 'Top 10 Student', 'Lọt top 10 bảng xếp hạng', 'Reached the top 10 leaderboard', 'Ranking', '#F59E0B', 300, 'leaderboard_rank', 10);
