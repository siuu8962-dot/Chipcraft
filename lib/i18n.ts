export const translations = {
  vi: {
    nav: {
      dashboard: 'Tổng quan',
      courses: 'Khóa học',
      ai_tutor: 'AI Tutor',
      lab: 'Phòng Lab',
      achievements: 'Thành tích',
      settings: 'Cài đặt',
    },
    dashboard: {
      welcome: 'Chào mừng trở lại, {name}!',
      streak: '{days} ngày liên tiếp',
      xp_to_next: '{xp} XP để lên cấp',
      continue_learning: 'Tiếp tục học',
      today_goal: 'Mục tiêu hôm nay',
      leaderboard: 'Bảng xếp hạng',
      recent_activity: 'Hoạt động gần đây',
    },
    courses: {
      title: 'Khóa Học Chip Design',
      search: 'Tìm kiếm khóa học...',
      filter_all: 'Tất cả',
      enroll: 'Ghi danh ngay',
      enrolled: 'Đã học',
      curriculum: 'Chương trình học',
      outcomes: 'Kết quả đạt được',
    },
    lesson: {
      tabs: {
        content: 'Bài học',
        ai: 'AI Tutor',
        lab: 'Phòng Lab',
        quiz: 'Quiz',
      },
      next: 'Bài sau',
      prev: 'Bài trước',
      complete: 'Hoàn thành bài học',
    },
    ai: {
      placeholder: 'Hỏi AI Tutor về Chip Design...',
      limit_reached: 'Bạn đã hết lượt sử dụng AI tháng này. Nâng cấp Pro để tiếp tục!',
      new_chat: 'Cuộc trò chuyện mới',
    },
    common: {
      save: 'Lưu',
      cancel: 'Hủy',
      logout: 'Đăng xuất',
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
    }
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      courses: 'Courses',
      ai_tutor: 'AI Tutor',
      lab: 'Lab',
      achievements: 'Achievements',
      settings: 'Settings',
    },
    dashboard: {
      welcome: 'Welcome back, {name}!',
      streak: '{days} day streak',
      xp_to_next: '{xp} XP to next level',
      continue_learning: 'Continue Learning',
      today_goal: "Today's Goal",
      leaderboard: 'Leaderboard',
      recent_activity: 'Recent Activity',
    },
    courses: {
      title: 'Chip Design Courses',
      search: 'Search courses...',
      filter_all: 'All',
      enroll: 'Enroll Now',
      enrolled: 'Enrolled',
      curriculum: 'Curriculum',
      outcomes: 'Learning Outcomes',
    },
    lesson: {
      tabs: {
        content: 'Lesson',
        ai: 'AI Tutor',
        lab: 'Lab',
        quiz: 'Quiz',
      },
      next: 'Next Lesson',
      prev: 'Previous Lesson',
      complete: 'Mark as Complete',
    },
    ai: {
      placeholder: 'Ask AI Tutor about Chip Design...',
      limit_reached: 'Monthly AI limit reached. Upgrade to Pro for more!',
      new_chat: 'New Conversation',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      logout: 'Log out',
      loading: 'Loading...',
      error: 'An error occurred',
    }
  }
}

export type Language = 'vi' | 'en'
export type TranslationKey = keyof typeof translations.vi
