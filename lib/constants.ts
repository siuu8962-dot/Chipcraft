export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ChipCraft'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const XP_PER_LESSON = 10
export const XP_PER_QUIZ_QUESTION = 5
export const XP_PER_LAB = 25

export const MONTHLY_AI_LIMIT_FREE = 20
export const MONTHLY_AI_LIMIT_PRO = 1000

export const DIFFICULTIES = {
  beginner: { label: 'Beginner', color: 'teal', label_vi: 'Cơ bản' },
  intermediate: { label: 'Intermediate', color: 'amber', label_vi: 'Trung cấp' },
  advanced: { label: 'Advanced', color: 'purple', label_vi: 'Nâng cao' },
  expert: { label: 'Expert', color: 'coral', label_vi: 'Chuyên gia' }
}

export const LESSON_TYPES = {
  video: { icon: 'VideoCamera', label: 'Video', label_vi: 'Video' },
  article: { icon: 'Article', label: 'Article', label_vi: 'Bài viết' },
  lab: { icon: 'Flask', label: 'Lab', label_vi: 'Thực hành' },
  quiz: { icon: 'Question', label: 'Quiz', label_vi: 'Trắc nghiệm' }
}
