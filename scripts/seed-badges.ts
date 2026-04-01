import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role to bypass RLS

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const badges = [
  {
    slug: 'first_lesson',
    name_vi: 'Bước Đầu Tiên',
    name_en: 'First Step',
    description_vi: 'Hoàn thành bài học đầu tiên',
    description_en: 'Complete your first lesson',
    xp_reward: 50,
    rarity: 'common',
    icon: 'BookOpen',
    condition_json: { type: 'lesson_count', value: 1 }
  },
  {
    slug: 'digital_logic_master',
    name_vi: 'Digital Logic Master',
    name_en: 'Digital Logic Master',
    description_vi: 'Hoàn thành toàn bộ chương Digital Logic',
    description_en: 'Complete the entire Digital Logic chapter',
    xp_reward: 150,
    rarity: 'rare',
    icon: 'Cpu',
    condition_json: { type: 'chapter_complete', value: 'digital-logic' }
  },
  {
    slug: 'verilog_beginner',
    name_vi: 'Verilog Beginner',
    name_en: 'Verilog Beginner',
    description_vi: 'Hoàn thành bài học Verilog đầu tiên',
    description_en: 'Complete your first Verilog lesson',
    xp_reward: 100,
    rarity: 'common',
    icon: 'Code2',
    condition_json: { type: 'lesson_tag', value: 'verilog', count: 1 }
  },
  {
    slug: 'verilog_pro',
    name_vi: 'Verilog Pro',
    name_en: 'Verilog Pro',
    description_vi: 'Hoàn thành 10 bài học Verilog',
    description_en: 'Complete 10 Verilog lessons',
    xp_reward: 300,
    rarity: 'epic',
    icon: 'Code2',
    condition_json: { type: 'lesson_tag', value: 'verilog', count: 10 }
  },
  {
    slug: 'streak_3',
    name_vi: 'Học Liên Tục 3 Ngày',
    name_en: '3-Day Streak',
    description_vi: 'Học 3 ngày liên tiếp không nghỉ',
    description_en: 'Study for 3 consecutive days',
    xp_reward: 50,
    rarity: 'common',
    icon: 'Flame',
    condition_json: { type: 'streak', value: 3 }
  },
  {
    slug: 'streak_7',
    name_vi: 'Tuần Lễ Vàng',
    name_en: 'Golden Week',
    description_vi: 'Học 7 ngày liên tiếp',
    description_en: 'Study for 7 consecutive days',
    xp_reward: 150,
    rarity: 'rare',
    icon: 'Flame',
    condition_json: { type: 'streak', value: 7 }
  },
  {
    slug: 'streak_30',
    name_vi: 'Tháng Kiên Trì',
    name_en: 'Perseverance Month',
    description_vi: 'Học 30 ngày liên tiếp',
    description_en: 'Study for 30 consecutive days',
    xp_reward: 500,
    rarity: 'legendary',
    icon: 'Flame',
    condition_json: { type: 'streak', value: 30 }
  },
  {
    slug: 'level_5',
    name_vi: 'Kỹ Sư Tập Sự',
    name_en: 'Apprentice Engineer',
    description_vi: 'Đạt Level 5',
    description_en: 'Reach Level 5',
    xp_reward: 100,
    rarity: 'common',
    icon: 'Star',
    condition_json: { type: 'level', value: 5 }
  },
  {
    slug: 'level_10',
    name_vi: 'Kỹ Sư Vi Mạch',
    name_en: 'IC Engineer',
    description_vi: 'Đạt Level 10',
    description_en: 'Reach Level 10',
    xp_reward: 1000,
    rarity: 'legendary',
    icon: 'Trophy',
    condition_json: { type: 'level', value: 10 }
  },
  {
    slug: 'xp_500',
    name_vi: 'Người Học Chăm Chỉ',
    name_en: 'Diligent Learner',
    description_vi: 'Tích lũy 500 XP',
    description_en: 'Accumulate 500 XP',
    xp_reward: 50,
    rarity: 'common',
    icon: 'Zap',
    condition_json: { type: 'total_xp', value: 500 }
  },
  {
    slug: 'xp_5000',
    name_vi: 'Chip Master',
    name_en: 'Chip Master',
    description_vi: 'Tích lũy 5000 XP',
    description_en: 'Accumulate 5000 XP',
    xp_reward: 500,
    rarity: 'epic',
    icon: 'Zap',
    condition_json: { type: 'total_xp', value: 5000 }
  },
]

async function seed() {
  console.log('Seeding badges...')
  for (const b of badges) {
    const { error } = await supabase
      .from('badges')
      .upsert(b, { onConflict: 'slug' })
    if (error) console.error(`Error seeding badge ${b.slug}:`, error)
    else console.log(`Seeded badge: ${b.slug}`)
  }
  console.log('Done!')
}

seed()
