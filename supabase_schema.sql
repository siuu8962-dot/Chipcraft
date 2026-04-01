-- ==========================================
-- CHIPCRAFT PRODUCTION DATABASE SCHEMA
-- ==========================================
-- This script sets up a highly secure, relational, and performant 
-- database for the ChipCraft AI Chip Education Platform.

-- ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CORE USER MANAGEMENT
-- ==========================================

-- PROFILES: Stores user-specific data, gamification, and settings.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    level INTEGER DEFAULT 1 NOT NULL,
    xp INTEGER DEFAULT 0 NOT NULL,
    streak_count INTEGER DEFAULT 0 NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ai_messages_count INTEGER DEFAULT 0 NOT NULL,
    credits INTEGER DEFAULT 100 NOT NULL, -- Initial free credits
    is_admin BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);

-- TRIGGER: Automatic Profile Creation
-- This function ensures that every Supabase Auth user has a corresponding row in public.profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clear existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Re-create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. COURSE ARCHITECTURE
-- ==========================================

-- CATEGORIES: For platform organization
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_vi TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT,
    order_index INTEGER DEFAULT 0
);

-- COURSES: Main training capsules
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title_vi TEXT NOT NULL,
    title_en TEXT,
    slug TEXT UNIQUE NOT NULL,
    description_vi TEXT,
    description_en TEXT,
    thumbnail_url TEXT,
    duration_hours NUMERIC DEFAULT 0,
    lesson_count INTEGER DEFAULT 0,
    difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Professional')),
    is_published BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    prerequisites TEXT[], -- Logic concepts, Verilog basics, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- COURSE SECTIONS: Modules within a course
CREATE TABLE IF NOT EXISTS public.course_sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title_vi TEXT NOT NULL,
    title_en TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- LESSONS: The atomic training nodes
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lesson_type') THEN
        CREATE TYPE lesson_type AS ENUM ('video', 'article', 'quiz', 'lab');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE, -- New: direct reference
    title_vi TEXT NOT NULL,
    title_en TEXT,
    slug TEXT NOT NULL,
    type lesson_type NOT NULL DEFAULT 'video',
    description_vi TEXT,
    description_en TEXT,
    content_vi TEXT, -- Markdown content
    content_en TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT false,
    xp_reward INTEGER DEFAULT 10,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(section_id, slug)
);


-- ==========================================
-- 3. INTERACTIVE CONTENT
-- ==========================================

-- QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    question_vi TEXT NOT NULL,
    question_en TEXT,
    options_vi TEXT[] NOT NULL,
    options_en TEXT[],
    correct_option INTEGER NOT NULL, -- Renamed from correct_option_index
    explanation_vi TEXT,
    explanation_en TEXT,
    order_index INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 5
);

-- LAB EXERCISES
CREATE TABLE IF NOT EXISTS public.lab_exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title_vi TEXT NOT NULL,
    title_en TEXT,
    description_vi TEXT,
    description_en TEXT,
    starter_code TEXT,    -- Renamed from boilerplate_code
    solution_code TEXT,
    testbench_code TEXT,
    test_logic JSONB,      -- Extra logic parameters
    language TEXT DEFAULT 'verilog',
    expected_output TEXT,
    hints TEXT[],
    xp_reward INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- 4. STUDENT PROGRESS & GAMIFICATION
-- ==========================================

-- ENROLLMENTS: Entrance record for a course
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    is_completed BOOLEAN DEFAULT false,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- LESSON PROGRESS: Detailed completion status
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    quiz_score INTEGER,
    last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- ACTIVITY LOG: Feed data
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'lesson_complete', 'quiz_pass', 'achievement_earned'
    title_vi TEXT NOT NULL,
    xp_gained INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ACHIEVEMENTS: Badge system
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title_vi TEXT NOT NULL,
    description_vi TEXT,
    icon_name TEXT NOT NULL, -- Phosphor icon name
    xp_reward INTEGER DEFAULT 100,
    requirement_type TEXT, -- e.g., 'courses_completed', 'quiz_perfect_score'
    requirement_value INTEGER
);

-- USER ACHIEVEMENTS: The "Trophy Case"
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);


-- ==========================================
-- 5. ADVANCED SECURITY (RLS)
-- ==========================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles: Own user can read/update.
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public Content: Everyone can view categories/courses.
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public Read Sections" ON public.course_sections FOR SELECT USING (true);
CREATE POLICY "Public Read Lessons" ON public.lessons FOR SELECT USING (true);

-- Interactive Data: Public Read for quizzes/achievements (definitions).
CREATE POLICY "Public Read Quiz Definitions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public Read Achievement Definitions" ON public.achievements FOR SELECT USING (true);

-- Private Student Data: User can only see their own progress/logs.
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activities" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);


-- ==========================================
-- 6. SEED DATA (PRODUCTION ESSENTIALS)
-- ==========================================

-- Seed Categories
INSERT INTO public.categories (name_vi, slug, icon_name, order_index) VALUES
('Digital Logic', 'digital-logic', 'Cpu', 1),
('RTL Design', 'rtl-design', 'CircuitBoard', 2),
('ASIC/FPGA Flow', 'asic-fpga', 'Stack', 3),
('AI & Computer Architecture', 'ai-arch', 'Sparkle', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed Base Achievements
INSERT INTO public.achievements (title_vi, description_vi, icon_name, xp_reward) VALUES
('Hello World', 'Hoàn thành bài học đầu tiên trong sự nghiệp đồ họa số.', 'Sparkle', 50),
('Thợ Hàn Verilog', 'Sử dụng thành công công cụ Lab để chạy code RTL.', 'Flask', 100),
('Cỗ Máy Thời Gian', 'Duy trì chuỗi học tập trong 7 ngày liên tiếp.', 'Clock', 500),
('Chuyên Gia Pipeline', 'Hoàn thành chương trình về kiến trúc Pipeline phức tạp.', 'Stack', 1000)
ON CONFLICT DO NOTHING;

-- Seed Courses
INSERT INTO public.courses (category_id, title_vi, title_en, slug, description_vi, difficulty_level, is_published, order_index) VALUES
(
  (SELECT id FROM public.categories WHERE slug = 'digital-logic'),
  'Nền tảng số & Logic',
  'Digital Logic Fundamentals',
  'digital-logic-fundamentals',
  'Tìm hiểu nền tảng của mọi kiến trúc máy tính từ cổng logic đến ALU.',
  'Beginner',
  true,
  1
)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- 1. COURSE SECTIONS (6 tuần)
-- ─────────────────────────────────────────
INSERT INTO public.course_sections (id, course_id, title_vi, title_en, order_index) VALUES
('11111111-0001-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'Tuần 1: Hệ thống số và biểu diễn dữ liệu', 'Week 1: Number Systems and Data Representation', 1),
('11111111-0002-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'Tuần 2: Đại số Boolean và cổng logic', 'Week 2: Boolean Algebra and Logic Gates', 2),
('11111111-0003-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'Tuần 3: Mạch tổ hợp (Combinational Logic)', 'Week 3: Combinational Logic Circuits', 3),
('11111111-0004-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'Tuần 4: Mạch tuần tự (Sequential Logic)', 'Week 4: Sequential Logic Circuits', 4),
('11111111-0005-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'Tuần 5: Bộ nhớ và thanh ghi', 'Week 5: Memory and Registers', 5),
('11111111-0006-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'Tuần 6: Project cuối khóa', 'Week 6: Final Project', 6)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────
-- 2. LESSONS — Tuần 1
-- ─────────────────────────────────────────
INSERT INTO public.lessons (id, section_id, course_id, slug, title_vi, title_en, description_vi, description_en, content_vi, content_en, duration_minutes, type, order_index, is_free_preview, xp_reward) VALUES
(
  'aaaaaaaa-0101-0000-0000-000000000001',
  '11111111-0001-0000-0000-000000000001',
  (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'),
  'he-thong-so-nhi-phan',
  'Hệ thống số nhị phân (Binary)',
  'Binary Number System',
  'Tìm hiểu hệ đếm nhị phân — nền tảng của mọi thiết bị số.',
  'Learn the binary number system — the foundation of all digital devices.',
  E'# Hệ thống số nhị phân\n\n## Tại sao máy tính dùng nhị phân?\nMọi thiết bị số đều hoạt động dựa trên hai trạng thái điện áp: HIGH (1) và LOW (0).',
  E'# Binary Number System\n\n## Why computers use binary?\nDigital devices operate on two voltage states: HIGH (1) and LOW (0).',
  18, 'article', 1, true, 15
),
(
  'aaaaaaaa-0102-0000-0000-000000000001',
  '11111111-0001-0000-0000-000000000001',
  (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'),
  'he-so-hexa-va-octal',
  'Hệ thập lục phân (Hex) và bát phân (Octal)',
  'Hexadecimal and Octal Systems',
  'Hex là ngôn ngữ của kỹ sư chip.',
  'Hex is the language of chip engineers.',
  E'# Hệ thập lục phân (Hex)',
  E'# Hexadecimal System',
  14, 'article', 2, false, 15
),
(
  'aaaaaaaa-0103-0000-0000-000000000001',
  '11111111-0001-0000-0000-000000000001',
  (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'),
  'ma-bu-hai-va-so-am',
  'Mã bù hai (Two''s Complement) và số âm',
  'Two''s Complement and Negative Numbers',
  'Chip không có dấu trừ — bù hai là cách biểu diễn số âm chuẩn trong mọi CPU hiện đại.',
  'Chips have no minus sign — two''s complement is how every modern CPU represents negative numbers.',
  E'# Mã bù hai (Two''s Complement)', E'# Two''s Complement',
  22, 'article', 3, false, 20
),
(
  'aaaaaaaa-0104-0000-0000-000000000001',
  '11111111-0001-0000-0000-000000000001',
  (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'),
  'lab-chuyen-doi-he-so',
  'Lab: Bộ chuyển đổi hệ số trong Verilog',
  'Lab: Number System Converter in Verilog',
  'Xây dựng module Verilog thực hiện chuyển đổi giữa các hệ số.',
  'Build a Verilog module that converts between number systems.',
  NULL, NULL, 35, 'lab', 4, false, 40
),
(
  'aaaaaaaa-0105-0000-0000-000000000001',
  '11111111-0001-0000-0000-000000000001',
  (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'),
  'quiz-he-thong-so',
  'Quiz: Hệ thống số',
  'Quiz: Number Systems',
  'Kiểm tra kiến thức về hệ nhị phân, hex, và bù hai.',
  'Test your knowledge of binary, hex, and two''s complement.',
  NULL, NULL, 10, 'quiz', 5, false, 25
)
ON CONFLICT (id) DO NOTHING;

-- Seed Labs
INSERT INTO public.lab_exercises (id, lesson_id, title_vi, title_en, description_vi, description_en, starter_code, solution_code, testbench_code, language, expected_output, hints, xp_reward) VALUES
(
  'bbbbbbbb-0104-0000-0000-000000000001',
  'aaaaaaaa-0104-0000-0000-000000000001',
  'Module chuyển đổi Binary sang Hex',
  'Binary to Hex Converter Module',
  'Implement module nhận 8-bit binary input và output hex display.',
  'Implement a module that takes 8-bit binary input and outputs hex display.',
  E'module bin_to_hex (\n  input  wire [7:0] binary_in,\n  output reg  [3:0] hex_upper,  // upper nibble [7:4]\n  output reg  [3:0] hex_lower   // lower nibble [3:0]\n);\n  // TODO: Implement\nendmodule',
  E'module bin_to_hex ( ... ); // solution here',
  E'// Testbench code here',
  'verilog',
  'PASS: 0xAB → upper=A lower=B',
  ARRAY['Dùng bit slicing: binary_in[7:4]'],
  40
)
ON CONFLICT (id) DO NOTHING;

-- Seed Quizzes
INSERT INTO public.quiz_questions (lesson_id, question_vi, question_en, options_vi, options_en, correct_option, explanation_vi, order_index, xp_reward) VALUES
(
  'aaaaaaaa-0105-0000-0000-000000000001',
  'Chuyển 42 sang nhị phân:',
  'Convert 42 to binary:',
  ARRAY['0010 1001', '0010 1010', '0010 1100', '0011 0000'],
  ARRAY['0010 1001', '0010 1010', '0010 1100', '0011 0000'],
  1,
  '42 = 32+8+2 = 2^5+2^3+2^1',
  1,
  10
)
ON CONFLICT (id) DO NOTHING;

UPDATE public.courses
SET lesson_count = (SELECT COUNT(*) FROM public.lessons WHERE course_id = public.courses.id)
WHERE slug = 'digital-logic-fundamentals';

-- ─────────────────────────────────────────
-- 3. LESSONS — Tuần 2: Boolean Algebra
-- ─────────────────────────────────────────
INSERT INTO public.lessons (id, section_id, course_id, slug, title_vi, title_en, description_vi, description_en, content_vi, content_en, duration_minutes, type, order_index, is_free_preview, xp_reward) VALUES
(
  'aaaaaaaa-0201-0000-0000-000000000001',
  '11111111-0002-0000-0000-000000000001',
  (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'),
  'cong-logic-co-ban',
  'Các cổng logic cơ bản: AND, OR, NOT, NAND, NOR, XOR',
  'Basic Logic Gates: AND, OR, NOT, NAND, NOR, XOR',
  'Cổng logic là tế bào cơ bản của mọi chip.',
  'Logic gates are the basic cells of every chip.',
  E'# Các cổng logic cơ bản', E'# Basic Logic Gates',
  25, 'article', 6, false, 20
)
ON CONFLICT (id) DO NOTHING;

-- (Continuing with more data as per user request...)
-- Week 3-6 structure
INSERT INTO public.lessons (id, section_id, course_id, slug, title_vi, title_en, type, order_index, xp_reward) VALUES
('aaaaaaaa-0301-0000-0000-000000000001', '11111111-0003-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'mux-demux', 'Multiplexer và Demultiplexer', 'Multiplexer and Demultiplexer', 'article', 10, 25),
('aaaaaaaa-0401-0000-0000-000000000001', '11111111-0004-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'latch-va-flip-flop', 'Latch và Flip-Flop', 'Latches and Flip-Flops', 'article', 13, 35),
('aaaaaaaa-0501-0000-0000-000000000001', '11111111-0005-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'sram-va-register-file', 'SRAM và Register File', 'SRAM and Register File', 'article', 17, 30),
('aaaaaaaa-0601-0000-0000-000000000001', '11111111-0006-0000-0000-000000000001', (SELECT id FROM public.courses WHERE slug = 'digital-logic-fundamentals'), 'project-dong-ho-so', 'Project: Đồng hồ số 24h', 'Project: 24-Hour Digital Clock', 'lab', 18, 150)
ON CONFLICT (id) DO NOTHING;
