-- 迁移：为 consultations 表添加 status 字段
-- 在 Supabase Dashboard > SQL Editor 中执行

ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'completed', 'failed'));

-- 将历史上 ai_response 已有内容的记录标记为 completed
UPDATE public.consultations
  SET status = 'completed'
  WHERE ai_response IS NOT NULL AND status = 'pending';

-- 索引（按状态查询）
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
