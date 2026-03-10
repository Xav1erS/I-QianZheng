-- 移·前程 移民签证AI顾问平台 - 数据库 Schema
-- 在 Supabase Dashboard > SQL Editor 中执行此文件

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- Table: users
-- =====================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 10 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.users IS '用户信息表，扩展 Supabase auth.users';
COMMENT ON COLUMN public.users.credits IS '剩余免费咨询次数，默认 10 次';

-- =====================
-- Table: consultations
-- =====================
CREATE TABLE public.consultations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  input_data JSONB NOT NULL,
  ai_response TEXT,
  visa_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.consultations IS '咨询记录表，存储用户输入和 AI 生成的报告';
COMMENT ON COLUMN public.consultations.input_data IS '用户填写的表单原始数据（JSON 格式）';
COMMENT ON COLUMN public.consultations.ai_response IS 'AI 生成的 Markdown 格式报告';
COMMENT ON COLUMN public.consultations.visa_type IS '推荐的签证类型（由 AI 返回后解析填充）';

-- =====================
-- Row Level Security (RLS)
-- =====================

-- users 表 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能查询自己的信息"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "用户只能更新自己的信息"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "用户只能插入自己的信息"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- consultations 表 RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能查询自己的咨询记录"
  ON public.consultations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的咨询记录"
  ON public.consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的咨询记录"
  ON public.consultations FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================
-- 触发器：新用户注册后自动创建 users 记录
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- Table: messages（追问对话）
-- =====================
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.messages IS '追问对话记录，每条 consultation 下的多轮问答';

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能查询自己咨询的消息"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "用户只能插入自己咨询的消息"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_id AND c.user_id = auth.uid()
    )
  );

-- =====================
-- 索引优化
-- =====================
CREATE INDEX idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX idx_consultations_created_at ON public.consultations(created_at DESC);
CREATE INDEX idx_messages_consultation_id ON public.messages(consultation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at ASC);
