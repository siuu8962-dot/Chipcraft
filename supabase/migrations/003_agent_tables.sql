-- ── AGENT TABLES ──

-- Table to track autonomous agent runs
CREATE TABLE IF NOT EXISTS public.agent_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    goal TEXT NOT NULL,
    steps JSONB DEFAULT '[]'::jsonb, -- Array of AgentStep
    final_answer TEXT,
    tools_used TEXT[] DEFAULT '{}'::text[],
    iterations INTEGER DEFAULT 0,
    status TEXT DEFAULT 'thinking', -- thinking | acting | done | error
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for long-term agent memory
CREATE TABLE IF NOT EXISTS public.agent_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL, -- skill_level | weak_topic | completed | fact
    content TEXT NOT NULL,
    importance INTEGER DEFAULT 1, -- 1-5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memories ENABLE ROW LEVEL SECURITY;

-- Policies for agent_runs
CREATE POLICY "Users can view their own agent runs" 
    ON public.agent_runs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent runs" 
    ON public.agent_runs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent runs" 
    ON public.agent_runs FOR UPDATE 
    USING (auth.uid() = user_id);

-- Policies for agent_memories
CREATE POLICY "Users can view their own agent memories" 
    ON public.agent_memories FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own agent memories" 
    ON public.agent_memories FOR ALL 
    USING (auth.uid() = user_id);
