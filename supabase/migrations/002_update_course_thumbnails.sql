-- Update Course Thumbnails with Robust Matching
-- This script handles potential slug mismatches by trying various slugs and matching by title as a fallback.

-- 1. Digital Logic
UPDATE public.courses 
SET thumbnail_url = '/image/digital-logic.png' 
WHERE slug IN ('digital-logic-fundamentals', 'digital-logic')
   OR title_vi LIKE '%Nền tảng số%';

-- 2. RTL Design
UPDATE public.courses 
SET thumbnail_url = '/image/rtl-design.png' 
WHERE slug IN ('rtl-design-verilog', 'rtl-design')
   OR title_vi LIKE '%RTL Design%';

-- 3. ASIC/FPGA
UPDATE public.courses 
SET thumbnail_url = '/image/asic.png' 
WHERE slug IN ('asic-fpga-flow', 'asic-design-flow', 'asic-fpga')
   OR title_vi LIKE '%ASIC%';

-- 4. AI & Computer Architecture
UPDATE public.courses 
SET thumbnail_url = '/image/AI.png' 
WHERE slug IN ('ai-computer-architecture', 'ai-chip-architecture', 'ai-arch')
   OR title_vi LIKE '%AI%';
